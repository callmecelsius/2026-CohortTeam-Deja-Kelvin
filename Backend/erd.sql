
//Do we want this singular or plural? 

Table users {
  id integer [primary key]
  employee_id integer [not null]
  username varchar
  firstname varchar
  lastname varchar 
  phone_number integer // listed as an integer for the time being 
  email varchar 
  address varchar 
  city varchar
  state varchar 
  zip integer 
  role varchar
  created_at timestamp
  updated_at timestamp 
}

Table roles {
  id integer [primary key]
  employee_id integer [not null]

}

// What is a good way to determine role of user
// whether Employee or Foster Parent? 

// if "Foster Parent" : need email, phone, address (street, city, state, zip)
// if "Employee": phone number, email (work/organization), employee ID number, title/position

// any additional information 

Table pets {

  id integer [primary key]
  user_id integer [not null] // one 
  pet_id integer [not null]// many
  name varchar
  species varchar // species (dog, cat) maybe different animals eventually 
  breed varchar // breed 
  age integer 
  date_of_birth datetime 
  vaccination_status boolean 
  adoption_status boolean
  created_at timestamp
  updated_at timestamp 
  
}


Table medical_history {
  
  id integer [primary key]
  pet_id integer [not null]
  urgent integer 
  behavior varchar
  date datetime 

}


Table products {
  
  id integer [primary key]
  user_id integer [not null]
  product_id integer [not null]
  name varchar 
  type varchar 
  price integer
  UPC integer
  is_purchased boolean 
  is_rented boolean 
  rent_start datetime
  rent_end datetime 
  description varchar 
  quantity integer 
  
}

/* 

Table category {

Question for the Team: would this also be beneficial to have a talbe for category? 

}

*/ 



Table cart {
  
  id integer [primary key]
  user_id integer [not null]
  product_id integer [not null]
  cart_id integer [not null]

}

/*
Table payment_details {



}

// product ID and Service ID would also go into shopping cart 

*/ 

Table requests {

  id integer [primary key]
  user_id integer [not null]
  pet_id integer [not null]
  name varchar
  description varchar
  appointment_availability integer 
} 


Ref user_pets: pets.user_id > users.id // many-to-one


Ref user_roles: roles.employee_id > users.employee_id

Ref user_product: products.user_id > users.id 

Ref user_services: requests.user_id > users.id

Ref medical_history: medical_history.pet_id > pets.pet_id

Ref pet_services: requests.pet_id > pets.pet_id

//Ref: users.id < follows.following_user_id

//Ref: users.id < follows.followed_user_id
