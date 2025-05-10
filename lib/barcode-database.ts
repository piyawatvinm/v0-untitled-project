// Mock barcode database that maps barcodes to product IDs in our system
export const mockBarcodeDatabase: Record<string, string> = {
  // EAN-13 format barcodes mapped to our product IDs
  "5901234123457": "p1", // Eggs
  "4003994155486": "p5", // Milk
  "8901234567893": "p3", // Chicken Breast
  "7501234567893": "p4", // Broccoli
  "6291041500213": "p6", // Tofu
  "3045320094084": "p7", // Rice
  "7622210100123": "p8", // Carrots
  "8410054010412": "p9", // Cheese
  "5449000000996": "p10", // Onion
  "8712345678906": "p11", // Pork
  "4890008100309": "p12", // Pasta
  "3800065711035": "p13", // Olive Oil
  "5000169116010": "p15", // Salmon
  "7891234567895": "p16", // Avocado
  "8000500003954": "p17", // Beef
  "5060073380635": "p18", // Spinach
  "3661112502850": "p19", // Yogurt
  "8717163262245": "p21", // Shrimp
  "5010477348678": "p22", // Bell Pepper
  "7310865004703": "p23", // Butter
  "9780201379624": "p30", // Bread
  "4902505079245": "p32", // Banana
  "5000213013398": "p33", // Pasta Sauce
  "7350053850019": "p35", // Tomatoes
  "5060073380642": "p36", // Cheddar Cheese
  "8076809529587": "p37", // Instant Noodles
  "8801043150125": "p38", // Soy Milk
  "4902430698146": "p45", // Mushrooms
  "8410100107042": "p49", // Lime
  "8480000591241": "p50", // Basil
  "5000237122267": "p51", // Coconut Milk
  "8001250123459": "p53", // Green Curry Paste
  "8715700110622": "p54", // Soy Sauce
  "8715700011097": "p55", // Green Papaya
  "8715700011103": "p56", // Chili
  "8715700011110": "p58", // Peanuts
  "8715700011127": "p59", // Garlic
  "8715700011134": "p60", // Basil
}
