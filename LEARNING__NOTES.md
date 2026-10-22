await = request ka result milne tak async fn ke agle kadam ko rokta hai
response.ok = http response safal status mein ha ya nhi
return per api request nhi bheji jati hai

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

