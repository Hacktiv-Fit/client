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

function genUserMealData() {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/wger/meal-list',
    headers: {
      currentUser: localStorage.currentUser,
      token: localStorage.token 
    }
  })
    .done(data => {
      console.log(data)
      if(data.length) {
        $('#no-list-message').hide()
        $('tbody#user-meal-listing').empty()
        data.forEach((ing, index) => {
          $('tbody#user-meal-listing').append(`<tr>
          <th scope="row">${index+1}</th>
          <td>${ing.name}</td>
          <td>${ing.energy}</td>
          <td>${ing.carbohydrates}</td>
          <td>${ing.protein}</td>
          <td>${ing.fat}</td>
          <td><button type="button" class="btn btn-warning" onclick="genIngredientUpdateModal(${ing.id})">Edit</button><button type="button" class="btn btn-danger" onclick="deleteIngredient(${ing.id})">Delete</button></td>
        </tr>`)
        })
      } else {
        $('#meal-list').hide()
        $('#no-list-message').show()
      }
    })
    .fail(err => {
      console.log(err)
    })
}

function genIngredientOptions() {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/wger/ingredients'
  })
    .done(data => {
      $('#ingredient-list').empty()
      data.forEach(ingredient => {
        $('#ingredient-list').append(`<option value="${ingredient.name}">${ingredient.name}</option>`)
      })
    })
    .fail(err => {
      console.log(err)
    })
}

function inputIngredientToUserMeal(name, amount) {
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/wger/ingredients',
    data: {
      ingredient_name: name,
      amount: amount
    },
    headers: {
      currentUser: localStorage.currentUser,
      token: localStorage.token
    }
  })
    .done(data => {
      console.log(data)
      $('#ingredientModal').modal('hide')
      genUserMealData()
    })
    .fail(err => {
      console.log(err)
    })
}

function genIngredientUpdateModal(id) {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/wger/ingredients'
  })
    .done(data => {
      $('#ingredient-list-edit').empty()
      data.forEach(ingredient => {
        $('#ingredient-list-edit').append(`<option value="${ingredient.name}">${ingredient.name}</option>`)
      })
    })
    .fail(err => {
      console.log(err)
    })
  localStorage.ingId = id
  $('#ingredientEditModal').modal('show')
}

function updateIngFromModal(name, amount) {
  $.ajax({
    method: 'PUT',
    url: `http://localhost:3000/wger/ingredients/${localStorage.ingId}`,
    data: {
      ingredient_name: name,
      amount: amount
    },
    headers: {
      currentUser: localStorage.currentUser,
      token: localStorage.token
    }
  })
    .done(data => {
      localStorage.removeItem('ingId')
      $('#ingredientEditModal').modal('hide')
      genUserMealData()
    })
    .fail(err => {
      console.log(err)
    })
}

function deleteIngredient(id) {
  $.ajax({
    method: 'DELETE',
    url: `http://localhost:3000/wger/ingredients/${id}`,
    headers: {
      currentUser: localStorage.currentUser,
      token: localStorage.token
    }
  })
    .done(data => {
      genUserMealData()
    })
    .fail(err => {
      console.log(err)
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

  // ready for ingredient list option
  genIngredientOptions()

  signOut()
  signInProject()
  signUpProject()
  signOutProject()

  genUserMealData()
  // submit new meal with first ingredient
  $('#new-ingredient-modal').on('click', () => {
    $('#amount-ingredient').val('')
  })

  $('#insert-ingredient').on('submit', e => {
    e.preventDefault()
    let ingredient_name = $('#ingredient-list').val()
    let amount = $('#amount-ingredient').val()
    inputIngredientToUserMeal(ingredient_name, amount)
  })

  $('#edit-ingredient').on('submit', e => {
    e.preventDefault()
    let ingredient_name = $('#ingredient-list-edit').val()
    let amount = $('#amount-ingredient-edit').val()
    updateIngFromModal(ingredient_name, amount)
  })
})