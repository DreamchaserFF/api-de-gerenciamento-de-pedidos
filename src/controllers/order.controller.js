const Order = require('../models/order.model');

// ============================================================
// POST /order — Cria um novo pedido
// ============================================================
const createOrder = async (req, res) => {
  try {
    // req.body é o JSON que chegou na requisição
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação — verifica se todos os campos obrigatórios vieram
    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // MAPEAMENTO — transforma os campos recebidos para o formato do banco
    const newOrder = new Order({
      orderId:      numeroPedido,
      value:        valorTotal,
      creationDate: new Date(dataCriacao),
      items: items.map(item => ({
        productId: item.idItem,
        quantity:  item.quantidadeItem,
        price:     item.valorItem
      }))
    });

    // Salva no banco de dados
    await newOrder.save();

    // Retorna 201 (criado) com o pedido salvo
    return res.status(201).json(newOrder);

  } catch (error) {
    // Se o orderId já existir no banco, o MongoDB retorna erro 11000
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Número de pedido já existe.' });
    }
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// GET /order/:orderId — Busca um pedido pelo número
// ============================================================
const getOrder = async (req, res) => {
  try {
    // req.params contém os parâmetros da URL (:orderId)
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    return res.status(200).json(order);

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// GET /order/list — Lista todos os pedidos
// ============================================================
const listOrders = async (req, res) => {
  try {
    // find() sem filtro retorna todos os documentos da coleção
    const orders = await Order.find();
    return res.status(200).json(orders);

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// PUT /order/:orderId — Atualiza um pedido existente
// ============================================================
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { valorTotal, dataCriacao, items } = req.body;

    // Monta o objeto apenas com os campos que vieram na requisição
    const updateData = {};
    if (valorTotal)  updateData.value        = valorTotal;
    if (dataCriacao) updateData.creationDate  = new Date(dataCriacao);
    if (items) {
      updateData.items = items.map(item => ({
        productId: item.idItem,
        quantity:  item.quantidadeItem,
        price:     item.valorItem
      }));
    }

    // findOneAndUpdate — busca pelo orderId e atualiza
    // { new: true } faz retornar o documento já atualizado
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    return res.status(200).json(updatedOrder);

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// DELETE /order/:orderId — Deleta um pedido
// ============================================================
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findOneAndDelete({ orderId });

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    // 200 com mensagem de confirmação
    return res.status(200).json({ message: `Pedido ${orderId} deletado com sucesso.` });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Exporta todas as funções para serem usadas nas rotas
module.exports = { createOrder, getOrder, listOrders, updateOrder, deleteOrder };