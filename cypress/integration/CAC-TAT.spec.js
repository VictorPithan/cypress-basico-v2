/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', function() {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })
  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores debitis veniam ullam similique sequi ducimus molestias, velit corrupti fuga! Ex tenetur labore dignissimos, voluptate quas doloribus velit a maxime deserunt.'
    cy.get('[name="firstName"]').type('Victor')
    cy.get('#lastName').as('lastname').type('Pithan')
    cy.get('#email').type('victor@email.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.success').as('success')

    cy.get('@success').should('be.visible')
  })
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('[name="firstName"]').type('Victor')
    cy.get('#lastName').as('lastname').type('Pithan')
    cy.get('#email').type('victor@email,com')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })
  it('campo telefone continua vazio quando preenchido com valor não-numérico', () => {
    cy.get('#phone')
      .type('abcdefghij')
      .should('have.value', '')
  })
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('[name="firstName"]').type('Victor')
    cy.get('#lastName').as('lastname').type('Pithan')
    cy.get('#email').type('victor@email,com')
    cy.get('#open-text-area').type('Teste')
    cy.get('#phone-checkbox').check()

    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('[name="firstName"]').type('Victor').should('have.value', 'Victor').clear().should('have.value', '')
    cy.get('#lastName').as('lastname').type('Pithan').should('have.value', 'Pithan').clear().should('have.value', '')
    cy.get('#email').type('victor@email.com').should('have.value', 'victor@email.com')
    cy.get('#open-text-area').type('Teste').should('have.value', 'Teste')

    cy.get('#email').clear().should('have.value', '')
    cy.get('#open-text-area').clear().should('have.value', '')
  })
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')
  })
  it('reescrevendo o código trocando o cy.get por cy.contains', () => {
    const longText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores debitis veniam ullam similique sequi ducimus molestias, velit corrupti fuga! Ex tenetur labore dignissimos, voluptate quas doloribus velit a maxime deserunt.'
    cy.get('[name="firstName"]').type('Victor')
    cy.get('#lastName').as('lastname').type('Pithan')
    cy.get('#email').type('victor@email.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()
    cy.get('.success').as('success')

    cy.get('@success').should('be.visible')
  })
  // it('Exemplo de login com variavel de ambiente', () => {
  //   cy.visit('https://exemplo.com/login')

  //   cy.get('#user')
  //     .type(Cypress.env('user_name'))
  //   cy.get('#password')
  //     .type(Cypress.env('user_password'), { log: false })
  //   cy.contains('Login').click()

  //   cy.get('.navbar-top .avatar')
  //     .should('be.visible')
  // })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })
  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })
  it('seleciona um produto (Blog) por seu indice (index)', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
  })
  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
    })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })
  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]#file-upload')
      .selectFile('@sampleFile')
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })
  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('Talking About Testing').should('be.visible')
  })
})