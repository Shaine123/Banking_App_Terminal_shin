import promtSync from "prompt-sync";
const prompt = promtSync({ sigint: true });
class Account {
    name;
    id;
    balance;
    constructor(name, balance) {
        this.name = name;
        this.id = Date.now();
        this.balance = balance;
    }
    getAccountInfo() {
        console.log("===== Account Info =====");
        console.log(`Name: ${this.name}`);
        console.log(`ID: ${this.id}`);
    }
}
class SavingsAccount extends Account {
    checkBalance() {
        console.log(this.balance);
    }
}
class CheckingAccount extends Account {
    checkBalance() {
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
    }
    else if (parseInt(choice) == 6) {
        console.log("Thank you for using my Bank!");
    }
} while (parseInt(choice) != 6);
//# sourceMappingURL=app.js.map