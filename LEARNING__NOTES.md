await = request ka result milne tak async fn ke agle kadam ko rokta hai
response.ok = http response safal status mein ha ya nhi
return per api request nhi bheji jati hai.
Koi fn khud se nhi chalta usey kahin se call karna padhta hai lekin har function ko chalane ke liye event hona zaroori nhi hai.

# day4
{console.log("city:", data.name);} hum yeh likh rhe the iski jagah ab hum [return data;] yeh likhenge issey fn apna poora data apne caller ko vapas deta hai. phir dusra function us data ko use kr sta hai apne kaam ke liye.

renderweather(data) yeh fn sirf data ko website pe dikhaayega api call nhi karega.
innerhtml us element ke andar html content daalega jo ek div bnaai thi result naam ki id di thi
${data.name} issey data ko html mein daal skte hai

- searchBtn... vaale ko async banaya hai kyunkinawait use krna tha aur iske andar hum likhenge
.trim() voh aagey aur peeche ke spaces hta dega jo user shaher ka naam likhega uska 
(!city) yahan neeche return zaroori hai agar nhi hota tohfn aage chlta rehta aur khali shaher ke naam se request bhejta rehta

## day5
-1, button click ki jagah form submit, button se event chalta hai, -- form ka submit click, aur enter dono kr skta hai iske liye sirf js mein change krna kaafi nhi hai html mein bhi input, button form ke andar likhna hoga.

2,important form use krte time
-normal html form submit hone par browser reload ho skta hai. hum js se weather data la rhe hai, isiliye page reload nhi hona chahiye. iske liye hum event.preventDefault() use krenge jisse apne aap na ho.
-- Pattern:
submit event-> preventdefault -> city read karo -> api call karo -> result dikhao.

3, button ko disable krna hai
kyunki user baar baar na dbaaye verna har baar dabane pe api jaati hai ek saath kayi saari api jaayengi toh confusion hoga.
searchBtn.disabled ka use kr rhe hai ab request poori hone ke baad dubara enable krna zaroori hai uske liye hum finally use krte hai
finally-- success aur error, dono mein execute hota hai.

try: weather laane aur screen per dikhane ki koshish.
catch: agar error aaye, toh user ko message dikhana.
finally: request khatam hone par button ko doabara enable krna. 

4, day 4 mein error check se pehle response body convert kr rhe the ab humne change kr diya hai ab pehle http check hoga afar city nhi mili toh fn errow throw karega. successful response mein json data return karega

### day6 kya banega?
1. temp toggle, 2. dobara api fetch (dusri unit mein same city ka), 3.refresh krne per purana weather vapas ana, 4.error handling, [dropdown box ka hmaare day 6 se koi talluq nhi hai voh form histury ki atocomplete suvidha hai dhyaan rahe uska hmaare localstorage se koi talluq nhi hai]
localStorage.setItem("lastcity",city); => pichle shaher ko save krvata hai.
localStorage.getItem("lastcity") => refresh ke baad pichla shaher vapas padhta hai
currentCity => unit badalne per usi shaher ka weather dubara fetch krne mein kaam aata hai.

(1,3) yeh dono kaam alag hai lekin dono mein ek common cheez use ho rhi hai local storage

refresh krne per purani prefernce(last city, and its unit{kyunki kuch change nhi hota same vohi page reload hoke aajata hai}) vapas lagu hoti hai, lekin weather data zaroori nhi ki purana ho update ho skta hai.

1, humne button banaya html, type button rakha kyunki agar submit rkhte toh form ke submit hone ki probab badh jaati, aur request chali jaati

let unit = localStorage.getItem("unit") === "imperial"// comparison hai ki theek imperial hai ya nhi
    ? "imperial"
    : "metric";


let currentCity = "";

localstorage => browser mein preference ko refresh ke baad bhi bachakar rakhta hai.
unit => js ko batata hai ki is samay app  kis unit per kaam kr rha hai. unit ki value pe hi weatherdata aata hai api se phir voh preference set ho  jaati hai localstorage pe bas . 

yahan shuru mein localstorage isiliye use kiya hai kyunki jab pehli baar user weather app kholega toh jab us time jo save ho ga ya nhi bhi hoga tab voh padhega aur chalega
currentcity variable stringa khaali choda hai taaki jab user daalega voh fill hojaayega aur agar nhi daalega toh vese hi chalega. 
user unit badalta hai toh variable aur localstorage dono update ho jaatey hain yahi poora cycle hai

// Togggle Celsius / Farenheit
unitToggle.addEventListener("click", async function() {
    unit = unit === "metric" ? "imperial" : "metric";
    

    localStorage.setItem("unit",unit);
    updateUnitButton();

    // City search hui hai to naya unit mein weather dobara lao
    if (currentCity) {
        await
        showWeatherForCity(currentCity);

hum localstorage = web api ka use krte hai aur uske methods ka .get/.set yeh web api do jagah kaam kar rha hai toggle krne mein aur refresh krne per kaam kr rha hai kyunki isme do cheezein save ho rhi hai unit, city last preference ke liye
Toggle pe click krne se do kaam honge ek unit naam ke variable ki value change hogi aur localstorage mein jo unit key ki value set ho gi 
aur us button pe jo likh ke aayega voh ulta likh ke aayega uske liye ek fn pehle se hi declare kra hai bas voh update hoke chal jaayega 
ab is per bhi poora weather procees chalega aur display krna hoga kyunki yeh bhi ek button hi submit ki tarah dabane pe event chalega output aayega.

currentCity = city;

localStorage.setItem("lastCity", city);

ab jo user daalega last city usey bhi store karvana hai localstorage ki key ki value jo ki aagey chalke use hogi yeh hmaare day 6 ke target pichla shaher yaad rakhna aur refresh ke baad usey dubara load karna.

day5 mein user search krta tha toh form ke andar hi saare kaam hote the  1, loading message 2,getweather(city) se weather fetch krna 3,renderweather se result dikhana 4, error handle krna, 5, button dubara enable krna poora process form submit ke saath juda hua tha 
ab day 6 ka target usme 3 situations aur hai search karna, conert krna, page refresh krna 
teeno ke kaam lagbhag ek jese hai toh humne in sab kaamon ko ek saath ek alag function deke karva liya aur us fn ko humne form kr andar use kr liya baad mein humne usey dclare kr diya aur isji ijazat js mein hai
isiliye form ke andar humne sirf yeh likha await showweatherforcity(city) 
input se shaher mila ab us shaher ke lioye poora weather process chalado

ab chunki units change ho rhi hai hard coded nhi hai isiliye renderweather mein humne variable liye aur unhi ko aagye humne use kiya jese jese upar demand change hogi vese vese unit variable ki value change hogi aur vese vese innerhtml mein saamne output mein likh ke aayegi.

loadsavedweather fn banaya gaya hai taaki app khulte hi pichli baar vala shaher apne aap load ho jaaye  iske liye kisi click event ki zaroorat nhi hai page khulte hi last vala preference poore weather procees ke saath load ho jaayega, pichli saved city ko restore kr rha hai.