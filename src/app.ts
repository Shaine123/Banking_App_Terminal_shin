import promtSync from "prompt-sync";

const prompt = promtSync({ sigint: true });

type AccountType = "Savings" | "Checking";
type TransactionType = "Deposit" | "Withraw" | "Transfer";

interface AccountInterface {
  accountOwner: string;
  Fname: string;
  Lname: string;
  id: number;
  balance: number;
  type: AccountType;
}

interface TransactionInterface {
  transactionType: TransactionType;
  amount: number;
  accountId: number;
  date?: string;
}

class Transactions {
  protected static transactions: TransactionInterface[] = [];

  createTransaction(transaction: TransactionInterface) {
    let currDate = new Date();
    Transactions.transactions.push({
      ...transaction,
      date: this.formatDate(currDate),
    });
  }

  viewTransactions() {
    if (Transactions.transactions.length <= 0) {
      console.log("No Transactions");
      return;
    }

    console.log("Transaction History");

    Transactions.transactions.forEach((trans, index) => {
      console.log(`${index + 1}.`);
      console.log(`${trans.transactionType}`);
      console.log(`$${trans.amount}`);
      console.log(`${trans.date}\n`);
    });
  }

  formatDate(date: Date) {
    let formatedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    return formatedDate;
  }
}

abstract class Account {
  public accountOwner: string;
  public Fname: string;
  public Lname: string;
  public id: number;
  public balance: number;
  public type: AccountType;

  protected static accountList: AccountInterface[] = [];

  constructor(
    id: number,
    accountOwner: string,
    Fname: string,
    Lname: string,
    balance: number,
    type: AccountType,
  ) {
    this.accountOwner = accountOwner;
    this.Fname = Fname;
    this.Lname = Lname;
    this.id = id;
    this.balance = balance;
    this.type = type;
  }
}

class Bank {
  protected static accountList: AccountInterface[] = [];

  private transactions = new Transactions();

  //create an account

  createAccount(account: AccountInterface): void {
    let filteredAccounts: AccountInterface[] | [] = [];

    if (account.type == "Savings") {
      filteredAccounts = Bank.accountList.filter((acc) => {
        return acc.type == "Savings";
      });
    } else if (account.type == "Checking") {
      filteredAccounts = Bank.accountList.filter((acc) => {
        return acc.type == "Checking";
      });
    }

    const checkAvailability = filteredAccounts.find(
      (item) => item.id == account.id,
    );

    if (checkAvailability !== undefined) {
      console.log("Account Number already exist !!");
      console.log("Please use a different Account Number\n");

      return;
    }

    if (account.balance < 500) {
      console.log("Insufficient Balance!");
      console.log(
        "Please put in a balance more than or equal to $500. Thank you \n",
      );

      return;
    }

    Bank.accountList.push({
      accountOwner: account.accountOwner,
      Fname: account.Fname,
      Lname: account.Lname,
      id: account.id,
      balance: account.balance,
      type: account.type,
    });

    console.log("== Account Created Successfully == \n");
  }

  //Deposit amount
  deposit(id: number, type: AccountType, balance: number): void {
    if (!this.findAccount(id)) {
      console.log("Account Number Does Not Exist !!");
      return;
    }

    if (balance < 100) {
      console.log("Insufficient Balance!");
      console.log(
        "Please put in a balance more than or equal to $500. Thank you \n",
      );

      return;
    }

    if (type == "Savings") {
      Bank.accountList.forEach((account) => {
        if (account.id == id && account.type == "Savings") {
          account.balance = account.balance + balance;
        }
      });
    } else if (type == "Checking") {
      Bank.accountList.forEach((account) => {
        if (account.id == id && account.type == "Checking") {
          account.balance = account.balance + balance;
        }
      });
    }

    this.transactions.createTransaction({
      transactionType: "Deposit",
      amount: balance,
      accountId: id,
    });

    console.log("Deposit Successfull !!\n");
  }

  //Withraw Amount from an account
  withrawAmount(id: number, type: string, balance: number): void {
    if (!this.findAccount(id)) {
      console.log("Account Number Does Not Exist !!");
      return;
    }

    let ownerAccount: AccountInterface | undefined = Bank.accountList.find(
      (item) => {
        if (item.id == id) {
          return item;
        }
      },
    );

    if (
      ownerAccount?.balance !== undefined &&
      ownerAccount?.balance < balance
    ) {
      console.log("Insufficient Balance \n");
      return;
    }

    Bank.accountList.forEach((account) => {
      if (account.id == id) {
        account.balance = account.balance - balance;
      }
    });

    this.transactions.createTransaction({
      transactionType: "Withraw",
      amount: balance,
      accountId: id,
    });

    console.log("Withraw Successful! \n");
  }

  //Transfer Balance
  transferAmount(acc1: number, acc2: number, amount: number) {
    let checkAccount1 = this.findAccount(acc1);
    if (!checkAccount1) {
      console.log("Transfer from account does not exist!");
      return;
    }

    let checkAccount2 = this.findAccount(acc2);
    if (!checkAccount2) {
      console.log("Transferred to account does not exist!");
      return;
    }

    if (amount < 100) {
      console.log("Insufficient Amount!");
      return;
    }

    // Reduce the balance from the first account

    let withrawingAccount: AccountInterface | undefined = Bank.accountList.find(
      (acc) => acc.id == acc1,
    );

    if (
      withrawingAccount?.balance != undefined &&
      withrawingAccount.balance < amount
    ) {
      console.log("Insufficient Account Balance!");
      return;
    }

    Bank.accountList.forEach((acc) => {
      if (acc.id === acc1) {
        acc.balance -= amount;
      } else if (acc.id === acc2) {
        acc.balance += amount;
      }
    });

    this.transactions.createTransaction({
      transactionType: "Transfer",
      amount: amount,
      accountId: acc1,
    });

    console.log("Transfer Successful!");
  }

  //View Balance on Account
  viewBalance(id: number, type: AccountType) {
    let isAccountExist = this.findAccount(id);

    if (!isAccountExist) {
      console.log("Account Not Found!");
      return;
    }

    const filterAccounts = Bank.accountList.filter((acc) => acc.type == type);

    const currentAccount: AccountInterface | undefined = filterAccounts.find(
      (acc) => acc.id == id,
    );

    if (currentAccount != undefined) {
      console.log("Owner:");
      console.log(`${currentAccount.accountOwner}\n`);

      console.log("Balance:");
      console.log(`$${currentAccount.balance}\n`);

      console.log(`Account Type: ${currentAccount.type}`);
    }
  }

  //Finding Account
  findAccount(id: number): boolean {
    const checkAvailability = Bank.accountList.find((item) => item.id == id);

    if (checkAvailability !== undefined) {
      return true;
    } else {
      return false;
    }
  }
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
  console.log("5. View Balance");
  console.log("6. History");
  console.log("7. Exit");

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

    const bank = new Bank();

    if (accountType == 1) {
      const savingsAcount = new SavingsAccount(
        accountNum,
        accountOwner,
        firstName,
        lastName,
        initialBalance,
        "Savings",
      );

      bank.createAccount(savingsAcount);
    } else if (accountType == 2) {
      const checkingAcount = new CheckingAccount(
        accountNum,
        accountOwner,
        firstName,
        lastName,
        initialBalance,
        "Checking",
      );

      bank.createAccount(checkingAcount);
    }
  } else if (parseInt(choice) == 2) {
    let accountNumber = parseInt(prompt("Please enter Account Number: "));
    let depositAmount = parseInt(prompt("Please enter Amount to Deposit: "));

    console.log("== Choose Account Type ==");
    console.log("1. SavingsAccount");
    console.log("2. Checking account");
    let accountType = parseInt(prompt("Enter: "));

    if (accountType !== 1 && accountType !== 2) {
      console.log("Invalid Account type please input 1 or 2. Thank you");
      accountType = parseInt(prompt(""));
    }

    let bank = new Bank();

    if (accountType == 1) {
      bank.deposit(accountNumber, "Savings", depositAmount);
    } else if (accountType == 2) {
      bank.deposit(accountNumber, "Checking", depositAmount);
    }
  } else if (parseInt(choice) == 3) {
    let accountNumber = parseInt(prompt("Please enter Account Number: "));
    let depositAmount = parseInt(prompt("Please enter Amount to Withdraw: "));

    console.log("== Choose Account Type ==");
    console.log("1. SavingsAccount");
    console.log("2. Checking account");
    let accountType = parseInt(prompt("Enter: "));

    if (accountType < 0) {
      console.log("Invalid Account type please input 1 or 2. Thank you");
      accountType = parseInt(prompt(""));
    }

    let bank = new Bank();

    if (accountType == 1) {
      bank.withrawAmount(accountNumber, "Savings", depositAmount);
    } else if (accountType == 2) {
      bank.withrawAmount(accountNumber, "Savings", depositAmount);
    }
  } else if (parseInt(choice) == 4) {
    console.log("Transfer to another account\n");
    let transferFrom = parseInt(prompt("From Account: "));
    let transferTo = parseInt(prompt("To Account: "));
    let amount = parseInt(prompt("Amount: "));

    let bank = new Bank();

    bank.transferAmount(transferFrom, transferTo, amount);
  } else if (parseInt(choice) == 5) {
    let accountNumber = parseInt(prompt("Account Number: "));

    console.log("== Choose Account Type ==");
    console.log("1. SavingsAccount");
    console.log("2. Checking account");
    let accountType = parseInt(prompt("Enter: "));

    if (accountType !== 1 && accountType !== 2) {
      console.log("Invalid Account type please input 1 or 2. Thank you");
      accountType = parseInt(prompt(""));
    }

    let bank = new Bank();

    if (accountType == 1) {
      bank.viewBalance(accountNumber, "Savings");
    } else {
      bank.viewBalance(accountNumber, "Checking");
    }
  } else if (parseInt(choice) == 6) {
    let transaction = new Transactions();

    transaction.viewTransactions();
  } else if (parseInt(choice) == 7) {
    console.log("Thank you for using my Bank!");
  }
} while (parseInt(choice) != 7);
