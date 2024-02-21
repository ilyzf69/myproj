import React from 'react';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    
    // Ici, vous devez remplacer avec l'URL correcte de votre API
    fetch('http://localhost/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Assurez-vous d'encoder les composants de l'URI
      body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log(data); // Traitez les données de réponse ici
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              onChange={this.handleEmailChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              onChange={this.handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Connexion</button>
        </form>
      </div>
    );
  }
}

export default LoginPage;
