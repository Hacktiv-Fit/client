
function nutritionixInputShow () {
    $('#nutritionix-input').show()
}

function nutritionixInput() {
    const token = localStorage.token
    const query = $('#nQuery').val()
    const gender = $('#nGender').val()
    const weight_kg = $('#nWeight').val()
    const height_cm = $('#nHeight').val()
    const age = $('#nAge').val()
    console.log(query, gender, weight_kg, height_cm, age, 'INPUT =========')
    $.ajax('http://localhost:3000/nutritionix/excercise', {
        method: 'POST',
        headers: { token },
        data: { query, gender, weight_kg, height_cm, age }
    })
    .done(({ data }) => {
        console.log(data)
    })
    .fail(err => {
        console.log(err)
    })
}

function nutritionix() {
    $('#nutritionix-input').on("submit", (e) => {
        e.preventDefault()
    const token = localStorage.token
    const query = $('#nQuery').val()
    const gender = $('input[name=gender]:checked', '#nutritionix-input').val()
    const weight_kg = $('#nWeight').val()
    const height_cm = $('#nHeight').val()
    const age = $('#nAge').val()
    console.log(query, gender, weight_kg, height_cm, age, 'INPUT =========')
    $.ajax('http://localhost:3000/nutritionix/excercise', {
        method: 'POST',
        headers: { token },
        data: { query, gender, weight_kg, height_cm, age }
    })
    .done( data => {
        console.log(data[0].nf_calories)
        $('#nutritionix-calories-output').empty()
        $('#nutritionix-type-output').empty()
        $('#nutritionix-calories-output').append(`
        <h5 id="calories" class="card-title">${data[0].nf_calories}</h5>
        `)
        $('#nutritionix-type-output').append(`
        <h5 id="calories" class="card-title">${data[0].name}</h5>
        `)
        $('#nWeight').val('')
        $('#nHeight').val('')
        $('#nQuery').val('')
        $('#nAge').val('')
    })
    .fail(err => {
        console.log(err)
    })
    })
}

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

//   nutritionix
nutritionix()
nutritionixInput()

  signOut()
  signInProject()
  signUpProject()
  signOutProject()
})
