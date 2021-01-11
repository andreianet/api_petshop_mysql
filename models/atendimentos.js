const conexao = require('../infra/conexao');
//biblioteca que manipula as datas e as formata.
const moment = require('moment');

class Atendimentos {
    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao); 
        const clienteEhValido = atendimento.cliente.length <=5;

        //objeto de validação
        const validacoes = [
            {
            nome: 'data',
            valido: dataEhValida,
            mensagem: 'Data deve ser maior ou igual a data atual'
        },
        {
            nome: 'cliente',
            valido: clienteEhValido,
            mensagem: 'Cliente deve ter menos que cinco caracteres'
        }
        ]

        const erros = validacoes.filter(campo => !campo.valido) //caso o campo NÃO for valido
        const existemErros = erros.length
        if (existemErros) {
            res.status(400).json(erros)
        }else{
           //const dataCriacao = new Date();
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            const sql = 'INSERT INTO Atendimentos SET ?'

        conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if (erro) {
               res.status(400).json(erro)
            }else{
                res.status(201).json(atendimento);
            }
            
        }) 
            
        }

        
    }

    lista(res){
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (erro, resultados) =>{
            if (erro) {
                res.status(400).json(erro)
            }else{
                res.status(200).json(resultados)
            }

        })
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

        conexao.query(sql, (erro, resultados) =>{
            const atendimento = resultados[0]; //devolver um atendimento
            if (erro) {
                res.status(400).json(erro)
            }else{
                res.status(200).json(atendimento)
            }

        })
    }

    altera(id, valores, res){
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`

        conexao.query(sql, [valores, id], (erro, resultados) =>{
            if (erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({...valores, id})
            }
        })

    }

    deleta(id, res){
        const sql = `DELETE FROM Atendimentos WHERE id=?`

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimentos