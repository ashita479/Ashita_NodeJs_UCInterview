const r = require('readline-sync');

function createName() 
{
  const first = r.question("Enter your first name: (keep it more than 4 letters) ");
  
  const short = first.slice(0, 4);
  const surnames = ["Geller", "Tribbiani", "Buffay", "Green", "Bing", "Wheeler", "Hannigan"];
  const random = surnames[Math.floor(Math.random() * 7)];
  console.log(`${short} ${random}`);
}

createName();
