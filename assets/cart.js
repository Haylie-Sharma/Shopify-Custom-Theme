document.addEventListener('DOMContentLoaded', () => {
 
  const quantityInputs = document.querySelectorAll('.quantity_input');
  let update = document.querySelector('.update_cart');
  quantityInputs.forEach(input => {
    input.addEventListener('change', (event) => {
       event.preventDefault(); 
      const newValue = event.target.value;
        update.click(); 
    });
  });

 

});
