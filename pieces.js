const titan_1 = '<div class="titan coin b" id="titan_b"><img src="titan.svg" alt="" class = "titan" height=40px></div>'
const titan_2 = '<div class="titan coin w" id="titan_w"><img src="titan.svg" alt="" class = "titan" height=40px></div>'
const tank_1 = '<div class="tank coin b" id="tank_b"><img src="tank.svg" alt="" class = "titan" height=40px></div>'
const tank_2 = '<div class="tank coin w" id="tank_w"><img src="tank.svg" alt="" class = "titan" height=40px></div>'
const cannon_1 = '<div class="cannon coin b" id="cannon_b"><img src="cannon.svg" alt="" class = "titan" height=40px></div>'
const cannon_2 = '<div class="cannon coin w" id="cannon_w"><img src="cannon.svg" alt="" class = "titan" height=40px></div>'
const ricochet_1 = '<div class="ricochet coin b" id="ricochet_b" style="transform:rotate(0deg)"><img style="transform:rotate(90deg)" src="ricochet.svg" alt="" class = "titan" height=40px></div>'
const ricochet_2 = '<div class="ricochet coin w" id="ricochet_w" style="transform:rotate(0deg)"><img  style="transform:rotate(90deg)" src="ricochet.svg" alt="" class = "titan" height=40px></div>'
const semi_1 = '<div class="semiricochet coin b" id="semi_b" style="transform:rotate(180deg)"><img  style="transform:rotate(90deg)" src="half-ricochet.svg" alt="" class = "titan" height=40px></div>'
const semi_2 = '<div class="semiricochet coin w" id="semi_w" style="transform:rotate(0deg)"><img  style="transform:rotate(90deg)" src="half-ricochet.svg" alt="" class = "titan" height=40px></div>'
const bullet_1 = '<div class="bullet" id="bullet_b"> <img style="transform:rotate(90deg)" src="bullet.svg" alt="" class = "titan" height=200px></div>'
const bullet_2 = '<div class="bullet" id="bullet_w"><img  style="transform:rotate(90deg)" src="bullet.svg" alt="" class = "titan" height=200px></div>'

const htmlToElement = function(html) {
    const template = document.createElement('template');
    template.innerHTML = html; // Avoid extra whitespace
    return template.content.firstChild; // Returns the first child of the template
}

const titan_b = htmlToElement(titan_1);
const titan_w = htmlToElement(titan_2);
const cannon_b = htmlToElement(cannon_1);
cannon_b.dataset.health = 1;
const cannon_w = htmlToElement(cannon_2);
cannon_w.dataset.health = 1;
const tank_b = htmlToElement(tank_1);
tank_b.dataset.health = 9;
const tank_w = htmlToElement(tank_2);
tank_w.dataset.health = 9;
const ricochet_b_1 = htmlToElement(ricochet_1);
const ricochet_b_2 = htmlToElement(ricochet_1);
const ricochet_w_1 = htmlToElement(ricochet_2);
const ricochet_w_2 = htmlToElement(ricochet_2);
const semi_b_1 = htmlToElement(semi_1);
const semi_w_1 = htmlToElement(semi_2);
const semi_b_2 = htmlToElement(semi_1);
const semi_w_2 = htmlToElement(semi_2);
const bullet_b = htmlToElement(bullet_1);
const bullet_w = htmlToElement(bullet_2);