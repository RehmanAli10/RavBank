"use strict";

// Data
const account1 = {
  owner: "Sultan Ahmad",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Rehman Ali",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Wasama Pasha",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Ali Tamoor",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, ind) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      ind + 1
    } ${type}</div>
    <div class="movements__value">${mov} €</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUserNames = function (accs) {
  accs.forEach(
    (acc) =>
      (acc.userName = acc.owner
        .toLowerCase()
        .split(" ")
        .map((words) => words.slice(0, 1))
        .join(""))
  );
};
createUserNames(accounts);

const updateUI = function (acc) {
  // Display movements

  displayMovements(acc.movements);

  // Display balance

  calcDisplayBalance(acc);

  // Display summary
  const summaryDetails = calcDisplaySummary(acc);
  const allSummaryDetails = summaryDetails();
  labelSumIn.textContent = `${allSummaryDetails.deposits} €`;
  labelSumOut.textContent = `${allSummaryDetails.withDraws} €`;
  labelSumInterest.textContent = `${allSummaryDetails.interest} €`;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, movement) {
    return acc + movement;
  }, 0);

  return (labelBalance.textContent = `${acc.balance} €`);
};

const calcDisplaySummary = function (acc) {
  const deposits = acc.movements
    .filter((curr) => curr > 0)
    .reduce((acc, curr) => acc + curr, 0);
  const interest = acc.movements
    .filter((curr) => curr > 0)
    .map((curr) => (curr * acc.interestRate) / 100)
    .filter((curr) => curr >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  return function withDraws() {
    const withDraws = acc.movements
      .filter((curr) => curr < 0)
      .reduce((acc, curr) => acc + curr, 0);
    return { withDraws: Math.abs(withDraws), deposits, interest };
  };
};

// Event handler
let currentAccount;
btnLogin.addEventListener("click", function (event) {
  // Prevent form from submitting
  event.preventDefault();
  currentAccount = accounts.find(function (accOwners) {
    return inputLoginUsername.value === accOwners.userName;
  });
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`;

    // Clearing input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Updating UI
    updateUI(currentAccount);
  }
});

// Transfering Amount

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  });
  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    transferTo?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
  }

  // Empty Input Fields
  inputTransferTo.value = inputTransferAmount.value = "";

  // Updating UI
  updateUI(currentAccount);
});

// LOAN

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add Movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  // Clearing input fields

  inputLoanAmount.value = "";
});

// Removing Account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const findCurrentAccount = accounts.findIndex(function (curr) {
      return (
        curr.userName === inputCloseUsername.value &&
        curr.pin === Number(inputClosePin.value)
      );
    });

    // Delete Account

    accounts.splice(findCurrentAccount, 1);

    // Hide UI

    containerApp.style.opacity = 0;
  }

  // InputFields Empty

  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
});
