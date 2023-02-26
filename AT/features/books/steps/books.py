# type: ignore
from behave import *
from selenium.webdriver import ActionChains, Keys
from selenium.webdriver.common.by import By
import time
import random


TIME_SLEEP = 1


def buscar_livros(context):
    context.browser.find_element(By.ID, 'search').send_keys(
        'mais lidos ' + random.randint(1, 1000).__str__())
    context.browser.find_element(By.XPATH, '//button[text()="Buscar"]').click()


def login(context, email="test1@test.com", password="123456"):
    context.browser.find_element(By.ID, 'email').send_keys(email)
    context.browser.find_element(By.ID, 'password').send_keys(password)
    context.browser.find_element(By.ID, 'password').send_keys(Keys.RETURN)
    time.sleep(TIME_SLEEP*1.5)


@given('que eu esteja na pagina principal')
def step_impl(context):
    context.browser.get('http://localhost/signin')
    login(context)
    time.sleep(TIME_SLEEP)


@given('que eu esteja na pagina principal logado com "{email}" e "{password}"')
def step_impl(context, email, password):
    context.browser.get('http://localhost/signin')
    login(context, email, password)
    time.sleep(TIME_SLEEP)


@ then('eu devo viasualizar uma lista de livros')
def step_impl(context):
    time.sleep(TIME_SLEEP)
    buscar_livros(context)

    time.sleep(TIME_SLEEP*5)


@ when(u'eu clicar no botão "Detalhes"')
def step_impl(context):
    buscar_livros(context)
    time.sleep(TIME_SLEEP*3)
    buttons = context.browser.find_elements(By.TAG_NAME, 'button')
    buttons[2].click()


@ then(u'eu devo viasualizar os detalhes do livro')
def step_impl(context):
    time.sleep(TIME_SLEEP*2)
    context.browser.find_element(By.XPATH, '//div[text()="Número de páginas"]')


@ given(u'que eu esteja com os detalhes do livro aberto')
def step_impl(context):
    time.sleep(TIME_SLEEP)
    context.browser.find_element(
        By.XPATH, '//button[text()="Marcar como lido"]')


@ when(u'eu clicar no botão "Marcar como lido"')
def step_impl(context):
    time.sleep(TIME_SLEEP*2)
    context.browser.find_element(
        By.XPATH, '//button[text()="Marcar como lido"]').click()


@ then(u'eu devo viasualizar o livro marcado com "Já li"')
def step_impl(context):
    time.sleep(TIME_SLEEP*5)
    context.browser.find_element(By.XPATH, '//button[text()="Já li"]')


@given(u'eu tenha marcado alguns livros como lidos')
def step_impl(context):
    ActionChains(context.browser).send_keys(Keys.ESCAPE).perform()

    buscar_livros(context)
    time.sleep(TIME_SLEEP*3)
    buttons = context.browser.find_elements(By.TAG_NAME, 'button')
    for button in buttons[3:]:
        time.sleep(TIME_SLEEP*0.5)
        button.click()
        time.sleep(TIME_SLEEP*0.8)
        context.browser.find_element(
            By.XPATH, '//button[text()="Marcar como lido"]').click()

        time.sleep(TIME_SLEEP*0.5)
        ActionChains(context.browser).send_keys(Keys.ESCAPE).perform()


@ when(u'eu clicar no botão "Meus pontos"')
def step_impl(context):
    time.sleep(TIME_SLEEP*2)
    ActionChains(context.browser).send_keys(Keys.ESCAPE).perform()
    context.browser.find_elements(By.TAG_NAME, 'button')[0].click()
    time.sleep(TIME_SLEEP*2)
    context.browser.find_element(
        By.XPATH, '//li[text()="Meus pontos"]').click()


@ then(u'eu devo viasualizar meus pontos e troféus')
def step_impl(context):
    time.sleep(TIME_SLEEP*5)
    context.browser.find_element(By.XPATH, '//h6[text()="Pontos"]')
    context.browser.find_element(By.XPATH, '//h6[text()="Troféus"]')


@then(u'eu devo viasualizar o ranking de leitores')
def step_impl(context):
    time.sleep(TIME_SLEEP*5)
