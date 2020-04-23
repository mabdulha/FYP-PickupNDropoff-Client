describe('Login Page', () => {
  const username = 'mozza'
  const password = 'secret'
  beforeEach(() => {
    cy.visit('/login/user')
  })
  it('check if page contains tabs', () => {
    cy.get('.v-tab')
      .eq(0)
      .should('contain', 'User')
    cy.get('.v-tab')
      .eq(1)
      .should('contain', 'Driver')
  })
  it('should login the user', () => {
    cy.get('.v-text-field__slot')
      .eq(0)
      .type(username)
    cy.get('.v-text-field__slot')
      .eq(1)
      .type(password)
    cy.get('.login-btn')
      .click()
  })
  // it('should log out the user', () => {
  //   cy.get('.v-btn__content')
  //     .should('contain', 'logout')
  // })
})
