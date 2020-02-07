let currentUser = localStorage.currentUser
// USER QUERY
function onSignIn(googleUser) {
  const token = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/gsignin',
    headers: {
      token
    }
  })
  .done( data => {
    localStorage.token = data.token
    localStorage.currentUser = data.name
    currentUser = data.name
  })
  .fail( err => {
    console.log(err)
  })
}

function signInProject () {
  $('#signIn').on('submit', (e) => {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/users/signin',
      data: {
        email: $('#email-login').val(),
        password: $('#password-login').val()
      }
    })
    .done( data => {
      $('#email-login').val('')
      $('#password-login').val('')
      localStorage.token = data.token
      localStorage.currentUser = data.name
      currentUser = data.name
      Swal.fire({
        title: 'Login Success !',
        text: `Welcome Back ${data.name} !`,
        icon: 'success',
        confirmButtonText: 'Cool !'
      })
    })
    .fail(() => {
      Swal.fire({
        title: 'Error!',
        text: `Email / Password Wrong !`,
        icon: 'error',
        confirmButtonText: 'Try Again !'
      })
    })
  })
}

function signUpProject () {
  $('#signUp').on('submit', (e) => {
    e.preventDefault()
    let name = $('#name-register').val()
    let email = $('#email-register').val()
    let password = $('#password-register').val()
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/users/signup',
      data: {
        name,
        email,
        password
      }
    })
    .done( () => {
      $('#name-register').val('')
      $('#email-register').val('')
      $('#password-register').val('')
      Swal.fire({
        title: 'Register Success!',
        text: `Plase Login !`,
        icon: 'success',
        confirmButtonText: 'Cool !'
      })
    })
    .fail( err => {
      Swal.fire({
        title: 'Ohhh Noo !!',
        text: `Register Fail !`,
        icon: 'error',
        confirmButtonText: 'Try Again !'
      })
    })
  })
}

function signOutProject () {
  $('#SignOut').on('click', () => {
    localStorage.clear()
    currentUser = ''
  })
}

function signOut() {
  $('#SignOut').on('click', function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      localStorage.clear()
      currentUser = ''
    })
  })
}


// DOCUMENT READY
$(document).ready(() => {
  // if(localStorage.getItem('token')) {
  //   fetchName()
  //   contentPage()
  //   fetchTodo()
  // } else {
  //   landingPage()
  // }

  signOut()
  signInProject()
  signUpProject()
  signOutProject()
})