# type: ignore
from behave import *

@given('Um cliente na pagina de login')
def step_impl(context):  
    raise NotImplementedError('STEP: Given Um cliente na pagina de login')


@when('o cliente faz o login com "{email}" e "{senha}"')
def step_impl(context, email, senha):
    raise NotImplementedError('STEP: When o cliente faz o login')


@then('ele deve ser redireciona para a listagem de livros')
def step_impl(context):
    raise NotImplementedError('STEP: Then ele deve ser redireciona para a listagem de livros')


