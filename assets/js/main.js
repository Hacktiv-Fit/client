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
    contentPage()
  })
  .fail( err => {
      Swal.fire({
        title: 'Error!',
        text: `Email / Password Wrong !`,
        icon: 'error',
        confirmButtonText: 'Try Again !'
      })
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
      contentPage()
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
      $('#registerModal').modal('hide')
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
    landingPage()
  })
}

function signOut() {
  $('#SignOut').on('click', function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      // console.log('User signed out.');
      localStorage.clear()
      currentUser = ''
      landingPage()
    })
  })
}


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
    // console.log(query, gender, weight_kg, height_cm, age, 'INPUT =========')
    $.ajax('http://localhost:3000/nutritionix/excercise', {
        method: 'POST',
        headers: { token },
        data: { query, gender, weight_kg, height_cm, age }
    })
    .done(({ data }) => {
        // console.log(data)
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
    // console.log(query, gender, weight_kg, height_cm, age, 'INPUT =========')
    $.ajax('http://localhost:3000/nutritionix/excercise', {
        method: 'POST',
        headers: { token },
        data: { query, gender, weight_kg, height_cm, age }
    })
    .done( data => {
        // console.log(data[0].nf_calories)
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
      Swal.fire({
        title: 'Error!',
        text: `${err.responseJSON.msg}`,
        icon: 'error',
        confirmButtonText: 'Try Again !'
      })
    })
    })
}

function landingPage() {
  $('#landingPage').show()
  $('#navbar').hide()
  $('#wger-meal-container').hide()
  $('#sportsDbPage').hide()
  $('#nutritionix').hide()
}

function fetchName() {
  $('#currentUser').empty()
  $('#currentUser').append(`Hello ${currentUser}`)
}

function contentPage() {
  fetchName()
  $('#landingPage').hide()
  $('#nutritionix').show()
  $('#wger-meal-container').show()
  $('#sportsDbPage').show()
  $('#navbar').show()
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
      // console.log(data)
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
      console.log(err,'aku disini')
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
      // console.log(data)
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

function sportsChoice() {
  $('#teamDiv').empty()
  $('#teamDiv').hide()
  $('#sportCountry').hide()
  $('#sportChoice').append(`
    <div class="card-body" >
        <br>
        <a id="footballCheck"><img src="https://pluspng.com/img-png/fifa-logo-png-fifa-logo-png-1500.png" style="width:150px"></i></i></a>
        <br><br>
        <a id="basketballCheck"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/International_Basketball_Federation_logo.svg/1200px-International_Basketball_Federation_logo.svg.png" style="width:150px"></i></a>
        <br><br>
        <a id="americanFootballCheck"><img src="https://seeklogo.com/images/I/international-federation-of-american-football-ifaf-logo-5088DFDCEF-seeklogo.com.png" style="width:150px"></i></a>
        <br>
    </div>
    <br>
  `)
  $('#footballCheck').on('click', (event) => {
    footballCountry()
  })
  $('#basketballCheck').on('click', (event) => {
    basketballCountry()
  })
  $('#americanFootballCheck').on('click', (event) => {
    americanFootballLeague()
  })
}

function footballCountry(){
  $('#teamLogo').hide()
  $('#sportCountry').empty()
  $('#sportCountry').show()
  $('#sportCountry').append(`
    <div class="card-body" >
        <br>
        <a id="footballEngland"><img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg" style="width:100px"></i></i></a>
        <br><br>
        <a id="footballItaly"><img src="https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg" style="width:100px"></i></a>
        <br><br>
        <a id="footballSpain"><img src="https://cdn.countryflags.com/thumbs/spain/flag-800.png" style="width:100px"></i></a>
        <br><br>
        <a id="footballGerman"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1280px-Flag_of_Germany.svg.png" style="width:100px"></i></i></a>
        <br>
    </div>
  `)
  $('#footballEngland').on('click', (event) => {
    footballLeague('England')
  })
  $('#footballSpain').on('click', (event) => {
    footballLeague('Spain')
  })
  $('#footballItaly').on('click', (event) => {
    footballLeague('Italy')
  })
  $('#footballGerman').on('click', (event) => {
    footballLeague('Germany')
  })
}

function footballLeague(country){
  $('#teamLogo').hide()
  if(country === 'England'){
    $('#sportCountry').empty()
    $('#sportCountry').append(`
      <div class="card-body" >
          <br>
          <a id="premierLeague"><img src="https://cdn.iconscout.com/icon/free/png-512/the-premier-league-569440.png" style="width:100px"></i></i></a>
          <br><br>
          <a id="championship"><img src="https://vignette.wikia.nocookie.net/fifa/images/3/33/EFL_Championship_Logo.png/revision/latest/scale-to-width-down/340?cb=20170117163142" style="width:100px"></i></a>
          <br><br>
          <a id="leagueOne"><img src="https://vignette.wikia.nocookie.net/fifa/images/b/bf/EFL_League_One_Logo.png/revision/latest?cb=20170117163348" style="width:100px"></i></a>
          <br>
      </div>
    `)
    $('#premierLeague').on('click', (event) => {
      footballTeams("English Premier League", country)
    })
    $('#championship').on('click', (event) => {
      footballTeams("English League Championship", country)
    })
    $('#leagueOne').on('click', (event) => {
      footballTeams("English League 1", country)
    })
  }
  else if(country === 'Italy'){
    $('#sportCountry').empty()
    $('#sportCountry').append(`
      <div class="card-body" >
          <br>
          <a id="serieA"><img src="https://vignette.wikia.nocookie.net/fifa/images/b/bf/Serie_A_Logo.png/revision/latest/scale-to-width-down/151?cb=20181007061141" style="width:100px"></i></i></a>
          <br><br>
          <a id="serieB"><img src="https://vignette.wikia.nocookie.net/fifa/images/8/8e/Serie_B_Logo.png/revision/latest/scale-to-width-down/158?cb=20161117182834" style="width:100px"></i></a>
          <br>
      </div>
    `)
    $('#serieA').on('click', (event) => {
      footballTeams("Italian Serie A", country)
    })
    $('#serieB').on('click', (event) => {
      footballTeams("Italian Serie B", country)
    })
  }
  else if(country === 'Spain'){
    $('#sportCountry').empty()
    $('#sportCountry').append(`
      <div class="card-body" >
          <br>
          <a id="laliga"><img src="https://vignette.wikia.nocookie.net/fifa/images/c/c3/Primera_Division_Logo.png/revision/latest/scale-to-width-down/200?cb=20161117172930" style="width:100px"></i></i></a>
          <br><br>
          <a id="segunda"><img src="https://image.winudf.com/v2/image/Y29tLmdyZW1hc3BvcnRzLnNlZ3VuZGEyMDE4X2ljb25fMTUzNDcwMzA5MV8wOTQ/icon.png?w=170&fakeurl=1" style="width:100px"></i></a>
          <br>
      </div>
    `)
    $('#laliga').on('click', (event) => {
      footballTeams("Spanish La Liga", country)
    })
    $('#segunda').on('click', (event) => {
      footballTeams("Spanish Adelante", country)
    })
  }
  else if(country === 'Germany'){
    $('#sportCountry').empty()
    $('#sportCountry').append(`
      <div class="card-body" >
          <br>
          <a id="bundesliga"><img src="https://vignette.wikia.nocookie.net/fifa/images/7/73/Bundesliga_Logo.png/revision/latest/scale-to-width-down/200?cb=20180211163850" style="width:100px"></i></i></a>
          <br><br>
          <a id="championship"><img src="https://vignette.wikia.nocookie.net/fifa/images/e/ec/2.Bundesliga_Logo.png/revision/latest/scale-to-width-down/181?cb=20170925234609" style="width:100px"></i></a>
          <br>
      </div>
    `)
    $('#bundesliga').on('click', (event) => {
      footballTeams("German Bundesliga", country)
    })
    $('#championship').on('click', (event) => {
      footballTeams("German 2. Bundesliga", country)
    })
  }
}

function footballTeams(league, country){
  $('#sportCountry').empty()
  $('#sportCountry').append(`
    <div class="card-body" id="teamLogo">
      <table class="table text-center">
        <tbody id="listItem">

        </tbody>
      </table>
    </div>
  `)
  $.ajax({
    url : 'http://localhost:3000/sportsDb/football',
    method : 'post',
    data : {
      country,
      league
    }
  })
  .then(result => {
    return $.ajax({
      url : 'http://localhost:3000/sportsDb/football',
      method : 'get'
    })
  })
  .then(result => {
    const teams = []
    for(let i = 0; i < result.length; i++){
      teams.push(result[i])
    }
    if(teams.length === result.length){
      showTeam(teams)
    }
  })
}

function basketballCountry(){
  $('#teamLogo').hide()
  $('#sportCountry').empty()
  $('#sportCountry').show()
  $('#sportCountry').append(`
    <div class="card-body" >
        <br>
        <a id="basketballUSA"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png" style="width:100px"></i></i></a>
        <br><br>
        <a id="basketballSpain"><img src="https://cdn.countryflags.com/thumbs/spain/flag-800.png" style="width:100px"></i></a>
        <br>
    </div>
  `)
  $('#basketballUSA').on('click', (event) => {
    basketballLeague('USA')
  })
  $('#basketballSpain').on('click', (event) => {
    basketballLeague('Spain')
  })
}

function basketballLeague(country){
  $('#teamLogo').hide()
  if(country === 'USA'){
    $('#sportCountry').empty()
    $('#sportCountry').append(`
      <div class="card-body" >
          <br>
          <a id="nba"><img src="https://pngimg.com/uploads/nba/nba_PNG6.png" style="width:100px"></i></i></a>
          <br><br>
          <a id="wnba"><img src="https://pluspng.com/img-png/logo-wnba-png-file-wnba-alternate-logo-2016-png-211.png" style="width:50px"></i></a>
          <br>
      </div>
    `)
    $('#nba').on('click', (event) => {
      basketballTeams("NBA", country)
    })
    $('#wnba').on('click', (event) => {
      basketballTeams("WNBA", country)
    })
  }
  else if(country === 'Spain'){
    $('#sportCountry').empty()
    basketballTeams("Spanish Liga ACB", country)
  }
}

function basketballTeams(league, country){
  $('#sportCountry').empty()
  $('#sportCountry').append(`
    <div class="card-body" id="teamLogo">
      <table class="table text-center bg-light">
        <tbody id="listItem">

        </tbody>
      </table>
    </div>
  `)
  $.ajax({
    url : 'http://localhost:3000/sportsDb/basketball',
    method : 'post',
    data : {
      country,
      league
    }
  })
  .then(result => {
    return $.ajax({
      url : 'http://localhost:3000/sportsDb/basketball',
      method : 'get'
    })
  })
  .then(result => {
    const teams = []
    for(let i = 0; i < result.length; i++){
      teams.push(result[i])
    }
    if(teams.length === result.length){
      showTeam(teams)
    }
  })
}

function americanFootballLeague(){
  $('#teamLogo').hide()
  $('#sportCountry').empty()
  $('#sportCountry').append(`
    <div class="card-body" >
        <br>
        <a id="nfl"><img src="https://www.pinclipart.com/picdir/middle/84-845569_transparent-images-pluspng-andrew-nfl-logo-clip-art.png" style="width:100px"></i></i></a>
        <br><br>
        <a id="ncaa"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/NCAA_logo.svg/1200px-NCAA_logo.svg.png" style="width:50px"></i></a>
        <br>
    </div>
  `)
  $('#nfl').on('click', (event) => {
    americanFootballTeams("NFL", 'USA')
  })
  $('#ncaa').on('click', (event) => {
    americanFootballTeams("NCAA Divisoin 1", 'USA')
  })
}

function americanFootballTeams(league, country){
  $('#sportCountry').empty()
  $('#sportCountry').append(`
    <div class="card-body" id="teamLogo">
      <table class="table text-center bg-light">
        <tbody id="listItem">

        </tbody>
      </table>
    </div>
  `)
  $.ajax({
    url : 'http://localhost:3000/sportsDb/americanFootball',
    method : 'post',
    data : {
      country,
      league
    }
  })
  .then(result => {
    return $.ajax({
      url : 'http://localhost:3000/sportsDb/americanFootball',
      method : 'get'
    })
  })
  .then(result => {
    const teams = []
    for(let i = 0; i < result.length; i++){
      teams.push(result[i])
    }
    if(teams.length === result.length){
      showTeam(teams)
    }
  })
}

function showTeam(teams){
  $('#teamDiv').show()
  $('#teamLogo').show()
  teams.forEach((data) => {
    console.log(data.strTeam)
      $('#listItem').append(`
        <tr>
          <td><a id="teamName${data.idTeam}"><img src="${data.strTeamBadge}" style="width:50px"></a></td>
        </tr>
      `)
      $(`#teamName${data.idTeam}`).on('click', (e) => {
        console.log(data)
        $('#teamDiv').empty()
        $('#teamDiv').append(`
          <div class="card card-signup z-depth-0 text-center bg-light">
            <div class="card-body">
              <table class="table bg-light">
                <tr>
                  <td><img src="${data.strTeamBadge}" style="width:50px"></td>
                </tr>
                <tr>
                  <td>${data.strTeam}</td>
                </tr>
                <tr>
                  <td>${data.strAlternate}</td>
                </tr>
                <tr>
                  <td>${data.intFormedYear}</td>
                </tr>
                <tr>
                  <td>${data.strLeague}</td>
                </tr>
                <tr>
                  <td>${data.strStadium}</td>
                </tr>
                <tr>
                  <td>${data.strDescriptionEN}</td>
                </tr>
              </table>
            </div>
          </div>
        `)
      })
  })

}

// DOCUMENT READY
$(document).ready(() => {
  if(localStorage.token) {
    fetchName()
    contentPage()
    genIngredientOptions()
    nutritionix()
  } else {
    landingPage()
  }

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
  sportsChoice()
})