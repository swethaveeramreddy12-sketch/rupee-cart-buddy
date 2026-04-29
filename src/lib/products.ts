export type Product = {
  id: string;
  name: string;
  price: number; // in INR
  image: string;
  description: string;
};

export const products: Product[] = [
  { id: "shoes", name: "SHOES", price: 415, image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", description: "Lorem ipsum dolor sit amet consectetur." },
  { id: "tshirt", name: "MEN's T-SHIRT", price: 526, image: "https://images.pexels.com/photos/3649765/pexels-photo-3649765.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Lorem ipsum dolor sit." },
  { id: "jeans", name: "JEANS", price: 749, image: "https://t4.ftcdn.net/jpg/02/50/85/71/360_F_250857127_RoCnqZQcUieIUQ4cMwHFSS2mBOqFjW71.jpg", description: "Lorem ipsum dolor sit amet." },
  { id: "watch", name: "WATCH", price: 759, image: "https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", description: "Lorem ipsum dolor sit." },
  { id: "phone", name: "SMART PHONE", price: 1660, image: "https://images.pexels.com/photos/6858618/pexels-photo-6858618.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", description: "Lorem ipsum dolor sit." },
  { id: "tv", name: "TELEVISION", price: 1495, image: "https://images.pexels.com/photos/5552789/pexels-photo-5552789.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", description: "Lorem ipsum dolor sit amet consectetur." },
  { id: "hoodies", name: "HOODIES", price: 556, image: "https://images.pexels.com/photos/4295985/pexels-photo-4295985.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Lorem ipsum dolor sit." },
  { id: "dinner", name: "DINNER SET", price: 830, image: "https://stehlen.in/cdn/shop/files/StehlenIndianRoundDinnerware_Puremelamine_33PCKitchenSetforhome-CREAMSAPPHIRE_b6d47e41-cb1d-47b3-9d63-295333ccb222.webp?v=1765630540", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit." },
  { id: "blankets", name: "BLANKETS", price: 822, image: "https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Lorem ipsum dolor sit amet consectetur adipisicing." },
  { id: "laptop", name: "LAPTOP", price: 8217, image: "https://images.pexels.com/photos/2659939/pexels-photo-2659939.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "microwave", name: "MICROWAVE", price: 2490, image: "https://web-res.midea.com/content/dam/toshiba-aem/nz/store/microwave/ml-em23pf(ss)/Microwave-oven-banner-revised-2.jpg/jcr:content/renditions/cq5dam.web.5000.5000.jpeg", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "coffee", name: "COFFEE MAKER", price: 2465, image: "https://img.freepik.com/free-photo/coffee-machine-brewing-espresso-with-beans_23-2152011989.jpg", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "bed", name: "BED", price: 8300, image: "https://images.pexels.com/photos/6606354/pexels-photo-6606354.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "ac", name: "AIR CONDITIONER", price: 6474, image: "https://plus.unsplash.com/premium_photo-1679943423706-570c6462f9a4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWlyJTIwY29uZGl0aW9uZXJ8ZW58MHx8MHx8fDA%3D", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "book", name: "BOOK", price: 749, image: "https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "bag", name: "BAG", price: 3030, image: "https://images.pexels.com/photos/4339598/pexels-photo-4339598.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "sarees", name: "SAREES", price: 2125, image: "https://www.pratibhasarees.com/cdn/shop/files/IMG_9901.jpg?v=1775555425&width=3024", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit." },
  { id: "washer", name: "WASHING MACHINE", price: 4648, image: "https://images.pexels.com/photos/5816934/pexels-photo-5816934.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", description: "Lorem ipsum dolor sit amet consectetur." },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);