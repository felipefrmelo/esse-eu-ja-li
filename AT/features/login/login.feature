Feature: Logar no sistema

  Scenario Outline: Logar com sucesso

     Given Um cliente na pagina de login
     When o cliente faz o login com "<email>" e "<senha>"
     Then ele deve ser redireciona para a listagem de livros

     Examples: Clientes de testes
       | email         | senha |
       | test@test.com | senha1234 |
