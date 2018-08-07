const buy = ingredients => new Promise(function(resolve, reject) {
    console.log(`Buying: ${ingredients}`);
    if (typeof ingredients !== 'undefined') {
        resolve(ingredients);
    } else {
        reject("(on-buying) buy whatever? really?!");
    }
});

function bakePie(ingredients) {
    console.log(`Baking pie from: ${ingredients}`);
    if (ingredients == "water") {
        throw Error(`(on-baking) Sorry, ${ingredients} evaporated`);
    }
    return `Pie-of-[${ingredients}]`;
}

function eatPie(pie) {
    console.log(`Eating pie: ${pie}`);    
}

function buyBakeEat(ingredients) {
    return buy(ingredients)
    .then(myIngredients => bakePie(myIngredients))
    .then(myPie => eatPie(myPie))
    .catch(err => {
        console.log(`Ooops: ${err}`);
        // throw err;
    })
    .then(() => {
        console.log(`Finally, done with ${ingredients}`);
    })
    ;
}

// :: kick-off three buyBakeEat promise-chains in parallel
// buyBakeEat("some apples");
// buyBakeEat("water");
// buyBakeEat();

// :: sequentially running three buyBakeEat promise-chains
const applyAsync = (acc,val) => acc.then(val);
const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));


// const bbe = ingredients => () => buyBakeEat(ingredients);  // equivalent to L:62+
const threeMeals = composeAsync(
    // () => buyBakeEat("breakfast"),
    // () => buyBakeEat("lunch"),
    // () => buyBakeEat("dinner")

    bbe("breakfast"),
    bbe("lunch"),
    bbe("dinner")

    // function() {return buyBakeEat("breakfast")},
    // function() {return buyBakeEat("lunch")},
    // function() {return buyBakeEat("dinner")}
);
threeMeals();

function bbe(ingredients) {
    // return () => buyBakeEat(ingredients);

    return function() {return buyBakeEat(ingredients)};
}


// :: sequentially running three buyBakeEat promise-chains
// Promise.resolve()
// .then(() => buyBakeEat("BB"))
// .then(() => buyBakeEat("LL"))
// .then(() => buyBakeEat("DD"))
// ;
