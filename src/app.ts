import promtSync from "prompt-sync";

const prompt = promtSync({ sigint: true });

interface account {
  accountOwner: string;
  Fname: string;
  Lname: string;
  id: number;
  balance: number;
}

abstract class Account {
  public accountOwner: string;
  public Fname: string;
  public Lname: string;
  public id: number;
  public balance: number;

  private accountList: account[] = [];

  constructor(
    id: number,
    accountOwner: string,
    Fname: string,
    Lname: string,
    balance: number,
  ) {
    this.accountOwner = accountOwner;
    this.Fname = Fname;
    this.Lname = Lname;
    this.id = id;
    this.balance = balance;

    this.accountList.push({
      accountOwner: accountOwner,
      Fname: Fname,
      Lname: Lname,
      id: id,
      balance: balance,
    });
  }

  viewAccounts(): void {
    console.log(this.accountList);
  }

  abstract checkBalance(): void;
}

class SavingsAccount extends Account {
  checkBalance(): void {
    console.log(this.balance);
  }
}

class CheckingAccount extends Account {
  checkBalance(): void {
    console.log(this.balance);
  }
}

let choice = undefined;

do {
  console.log("==== My Bank ====");
  console.log("1. Create Account");
  console.log("2. Deposit");
  console.log("3. Withdraw");
  console.log("4. Transfer");
  console.log("5. History");
  console.log("6. Exit");

  choice = prompt("Input choice: ");

  if (parseInt(choice) == 1) {
    console.log("== Create Account == \n");

    let accountNum = parseInt(prompt("Account Number: "));
    let accountOwner = prompt("Account Owner: ");
    let firstName = prompt("First Name: ");
    let lastName = prompt("Last Name: ");
    let initialBalance = parseInt(prompt("Initial Balance: "));

    console.log("== Choose Account Type ==");
    console.log("1. SavingsAccount");
    console.log("2. Checking account");
    let accountType = parseInt(prompt(""));

    if (accountType == 1) {
      const savingsAccount = new SavingsAccount(
        accountNum,
        accountOwner,
        firstName,
        lastName,
        initialBalance,
      );
    } else if (accountType == 2) {
      const savingsAccount = new CheckingAccount(
        accountNum,
        accountOwner,
        firstName,
        lastName,
        initialBalance,
      );
    }
  } else if (parseInt(choice) == 6) {
    console.log("Thank you for using my Bank!");
  }
} while (parseInt(choice) != 6);
