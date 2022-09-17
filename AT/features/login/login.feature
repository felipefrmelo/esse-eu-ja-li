#language: pt
Funcionalidade: Logar no sistema

  Esquema do Cenário: Logar com sucesso

     Dado Um cliente na pagina de login
     Quando o cliente faz o login com "<email>" e "<senha>"
     Então ele deve ser redireciona para a listagem de livros

     Exemplos: Clientes de teste
       | email         | senha |
       | test@test.com | 123456 |
