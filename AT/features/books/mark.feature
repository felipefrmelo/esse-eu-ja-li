#language: pt

Funcionalidade: Marcar livro como lido

    Cenario: Cliente marca livro na listagem de livros

      Dado que eu esteja pagina de listagem de livros
      Quando eu clico no icone de marcar
      Então o icone deve altenar de cor sinalizado que está marcado

    Cenario: Cliente marca livro na pagina de detalhes do livro

      Dado que esteja na pagina de detalhe do livro
      Quando clico no botão "Esse eu já li" com fundo transparente
      Então o fundo do botão deve mudar para verde
