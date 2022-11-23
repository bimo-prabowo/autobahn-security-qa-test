const { eq } = require("lodash")

// CHANGE PER RUN
const email = "autobahn-security@mailiantor.com";

describe('Sign Up for Autobahn Security', () => {
  it('Should sign user up', () => {
    // Opens signup page
    cy.visit('https://autobahn.security/signup')

    // Assert Company logo visible
    cy.get("img[class='header-icons']").as('companyLogo').should('be.visible')

    // Assert trial detail should be  with the correct text
    cy.get("h1[class='heading']").as('heading').should('be.visible')
    cy.get("@heading").should('have.text', 'Start a free 14-day trial')

    // Assert no credit card required
    cy.get("p[class='subtitle center text-muted paragraph medium']").as('subtitle').should('be.visible')
    cy.get("@subtitle").should('have.text', 'No credit card required')

    // E-mail input form check
    cy.get("input[name='email']").as('emailInput').should('be.visible')
    cy.get("@emailInput").invoke('attr', 'placeholder').should('eq', 'Work email*');

    // Password input form check
    cy.get("input[name='password']").as('passwordInput').should('be.visible')
    cy.get("@passwordInput").invoke('attr', 'placeholder').should('eq', 'Password*');

    // Get Signup Button
    cy.get("p[class='button-text paragraph button-large']").as('bottomButton');
    cy.get("@bottomButton").should('have.text', 'Sign up');

    // Get Terms and Condition detail
    cy.get("p[id='agree-text']").as('termsAndConditionsText');
    cy.get("@termsAndConditionsText").should('contain.text', 'By clicking Sign up, I agree to Autobahn\'\s Terms of Use and the Privacy Policy.');

    // Get Already registered message
    cy.get("p[id=already-registered-text]").as('alreadyRegistered');
    cy.get("@alreadyRegistered").should('contain.text', 'Already have an account? Log in');

    // Set e-mail address and clear
    cy.get("@emailInput").type(email).clear();

    // Set password
    cy.get("@passwordInput").type("67vzV5C6");

    // Verify strong password recommendations
    cy.get("div[class='bar-text']").as('passwordStrength');
    cy.get("div[class='feedback-suggestion'] > ul").children().as('passwordSuggestions');

    // Verify password strength is weak
    cy.get('@passwordStrength').should('have.text', 'Weak');

    // Verify password suggestions
    cy.get("@passwordSuggestions").should('have.length', 6);
    cy.get("@passwordSuggestions").eq(0).invoke('attr', 'class').should('eq', 'is-fulfilled');
    cy.get("@passwordSuggestions").eq(0).should('contain.text', 'At least 8 characters');

    cy.get("@passwordSuggestions").eq(1).invoke('attr', 'class').should('eq', 'is-fulfilled');
    cy.get("@passwordSuggestions").eq(1).should('contain.text', 'One uppercase letter');

    cy.get("@passwordSuggestions").eq(2).invoke('attr', 'class').should('eq', 'is-fulfilled');
    cy.get("@passwordSuggestions").eq(2).should('contain.text', 'One lowercase letter');

    cy.get("@passwordSuggestions").eq(3).invoke('attr', 'class').should('eq', 'is-fulfilled');
    cy.get("@passwordSuggestions").eq(3).should('contain.text', 'One number');

    cy.get("@passwordSuggestions").eq(4).invoke('attr', 'class').should('eq', '');
    cy.get("@passwordSuggestions").eq(4).should('contain.text', 'One special character');

    cy.get("@passwordSuggestions").eq(5).invoke('attr', 'class').should('eq', 'is-fulfilled');
    cy.get("@passwordSuggestions").eq(5).should('contain.text', 'No empty space');

    // Add special character
    cy.get("@passwordInput").type("!");

    // Verify password strength is strong
    cy.get('@passwordStrength').should('have.text', 'Strong');

    // Add more special characters
    cy.get("@passwordInput").type("@#");

    // Verify password strength is very strong
    cy.get('@passwordStrength').should('have.text', 'Very Strong');

    // Verify that e-mail is required
    cy.get('label').should('contain.text', 'Field cannot be empty');

    // Re-enter e-mail
    cy.get("@emailInput").type(email);

    // Click sign up button
    cy.get("@bottomButton").click();

    // Verify Sign up button and registration details are changed
    cy.get("@bottomButton").should('not.exist');
    cy.wait(5000);

    cy.get("@heading").should('have.text', 'Welcome!');
    cy.get("@heading").should('not.have.text', 'Start a free 14-day trial');
    cy.get("@subtitle").should('not.have.text', 'No credit card required');
    cy.get("@subtitle").should('have.text', 'Add your info to make collaborating easy');
    cy.get("@bottomButton").should('not.have.text', 'Sign up');
    cy.get("@bottomButton").should('have.text', 'Start using Autobahn');

    // Type in names
    cy.get("input[name='first-name']").as('firstNameInput').type("Sample First Name");
    cy.get("input[name='last-name']").as('lastNameInput').type("Sample Last Name");

    // Select industry
    cy.get("div[name='industry']").as('industrySelection').click();
    cy.get("div[class='menu toggled']").children().eq(1).as('commercialServices').click();

    // Verify selected industry as "Commercial Services"
    cy.get("div[class='option-selected']").as('selectedIndustry').should('have.text', 'Commercial Services');

    // Select country code for phone number
    cy.get("div[class='iti__flag-container']").as('flagContainer').click();
    cy.get("ul[class='iti__country-list']").children().eq(1).as('selectedCountry').click();

    // Verify UK is the selected country
    cy.get("@flagContainer").children().eq(0).invoke('attr', 'title').should('eq', 'United Kingdom: +44');

    // Insert phone number
    cy.get("input[name='phone-number']").as("phoneNumberInput").type("1234567890");

    // Click submit button to finish registration
    cy.get("@bottomButton").click();

    // Verify heading becomes E-mail verification prompt
    cy.get("@heading").should('have.text', 'Verify Your Email');
    cy.get("@heading").should('not.have.text', 'Welcome!');

    // Verify next step prompt
    cy.get("p[class='paragraph large center']").as('nextStepPrompt')
    .should('have.text', 'Please follow the instructions in the verification email to activate your account. Your first scan will start automatically after clicking the verification link.');

    // Verify bottom button text
    cy.get("@bottomButton").should('have.text', 'Resend Verification Link');
  })
})