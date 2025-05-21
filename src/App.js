import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [produto, setProduto] = useState({ nome: '', preco: '', quantidade: '' });
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'

  const handleChange = (e) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: produto.nome,
          preco: parseFloat(produto.preco),
          quantidade: parseInt(produto.quantidade),
        }),
      });

      const texto = await response.text();

      if (!response.ok) {
        setTipoMensagem('erro');
        setMensagem(texto);
      } else {
        setTipoMensagem('sucesso');
        setMensagem(texto);
        setProduto({ nome: '', preco: '', quantidade: '' });
        fetchProdutos();
      }
    } catch (error) {
      setTipoMensagem('erro');
      setMensagem('Erro ao conectar com o servidor.');
    }

    // Limpa a mensagem após 5 segundos
    setTimeout(() => {
      setMensagem('');
      setTipoMensagem('');
    }, 5000);
  };

  const fetchProdutos = async () => {
    const response = await fetch('http://localhost:3000/produtos');
    const data = await response.json();
    setProdutos(data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="container">
      <h1>Steam</h1>
      <img src="https://static.vecteezy.com/system/resources/previews/020/975/553/non_2x/steam-logo-steam-icon-transparent-free-png.png">
      </img>

      {mensagem && (
        <div className={`mensagem ${tipoMensagem}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome do Jogo" value={produto.nome} onChange={handleChange} required />
        <input name="preco" type="number" placeholder="Preço" value={produto.preco} onChange={handleChange} step="0.01" required />
        <input name="quantidade" type="number" placeholder="Quantidade" value={produto.quantidade} onChange={handleChange} required />
        <button type="submit">Comprar</button>
      </form>

      <h2>Jogos Disponíveis</h2>
      <ul>
        {produtos.map((p, index) => (
          <li key={index}>{p.nome} - R$ {p.preco.toFixed(2)} - Quantidade: {p.quantidade}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
