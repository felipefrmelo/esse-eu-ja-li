#language: pt

Funcionalidade: Listar livros

    Cenario: Cliente consulta livros cadastrados no site

      Dado que eu esteja na pagina principal
      Então eu devo viasualizar uma lista de livros

    Cenario: Cliente verifica detalhes do livro

      Dado que eu esteja na pagina principal
      Quando eu clicar no botão "Detalhes"
      Então eu devo viasualizar os detalhes do livro

    Cenario: Cliente marca livro como lido

      Dado que eu esteja com os detalhes do livro aberto
      Quando eu clicar no botão "Marcar como lido"
      Então eu devo viasualizar o livro marcado com "Já li"

    Cenario: Cliente visualiza seus pontos e troféus

      Dado que eu esteja na pagina principal
      E eu tenha marcado alguns livros como lidos
      Quando eu clicar no botão "Meus pontos"
      Então eu devo viasualizar meus pontos e troféus
