import { useState, useEffect, useRef } from "react";

// ─── PLAYER DATABASE ──────────────────────────────────────────────────────────
// Real per-game peak stats. NO overall rating. Most players = single position;
// only true positional hybrids get a second slot.
// More teams per era (incl. weaker ones) so a random roll is genuinely random.
const TEAMS = {
  "1960s": {
    "Celtics":   { colors:["#007A33","#BA9653"], players:[
      { name:"Bill Russell", pos:["C"], pts:15.1, reb:24.3, ast:4.3, stl:0.0, blk:0.0 },
      { name:"John Havlicek", pos:["SG","SF"], pts:18.0, reb:6.0, ast:4.0, stl:0.0, blk:0.0 },
      { name:"Sam Jones", pos:["SG"], pts:17.7, reb:4.9, ast:2.8, stl:0.0, blk:0.0 },
      { name:"Bob Cousy", pos:["PG"], pts:18.4, reb:5.5, ast:8.0, stl:0.0, blk:0.0 },
      { name:"Tom Heinsohn", pos:["PF"], pts:18.6, reb:8.8, ast:2.0, stl:0.0, blk:0.0 },
      { name:"K.C. Jones", pos:["PG"], pts:7.4, reb:3.5, ast:4.3, stl:0.0, blk:0.0 },
      { name:"Bailey Howell", pos:["PF"], pts:18.9, reb:8.1, ast:1.8, stl:0.0, blk:0.0 },
    ]},
    "Warriors":  { colors:["#1D428A","#FFC72C"], players:[
      { name:"Wilt Chamberlain", pos:["C"], pts:41.5, reb:25.1, ast:4.6, stl:0.0, blk:0.0 },
      { name:"Nate Thurmond", pos:["C","PF"], pts:16.5, reb:16.9, ast:2.5, stl:0.0, blk:0.0 },
      { name:"Paul Arizin", pos:["SF"], pts:22.8, reb:8.6, ast:2.3, stl:0.0, blk:0.0 },
      { name:"Tom Meschery", pos:["PF"], pts:12.9, reb:9.4, ast:1.8, stl:0.0, blk:0.0 },
      { name:"Guy Rodgers", pos:["PG"], pts:11.7, reb:4.5, ast:8.8, stl:0.0, blk:0.0 },
      { name:"Al Attles", pos:["PG","SG"], pts:8.9, reb:3.5, ast:3.5, stl:0.0, blk:0.0 },
    ]},
    "Lakers":    { colors:["#552583","#FDB927"], players:[
      { name:"Jerry West", pos:["PG","SG"], pts:27.0, reb:5.8, ast:6.3, stl:0.0, blk:0.0 },
      { name:"Elgin Baylor", pos:["SF","PF"], pts:27.4, reb:13.5, ast:4.0, stl:0.0, blk:0.0 },
      { name:"Gail Goodrich", pos:["SG"], pts:14.3, reb:2.9, ast:3.5, stl:0.0, blk:0.0 },
      { name:"Rudy LaRusso", pos:["PF"], pts:15.6, reb:9.4, ast:1.9, stl:0.0, blk:0.0 },
      { name:"LeRoy Ellis", pos:["C"], pts:11.0, reb:9.5, ast:1.2, stl:0.0, blk:0.0 },
    ]},
    "Royals":    { colors:["#C8102E","#000000"], players:[
      { name:"Oscar Robertson", pos:["PG","SG"], pts:30.5, reb:8.5, ast:10.6, stl:0.0, blk:0.0 },
      { name:"Jerry Lucas", pos:["PF","C"], pts:18.9, reb:18.4, ast:3.0, stl:0.0, blk:0.0 },
      { name:"Wayne Embry", pos:["C"], pts:14.0, reb:10.0, ast:2.0, stl:0.0, blk:0.0 },
      { name:"Jack Twyman", pos:["SF"], pts:18.5, reb:6.5, ast:2.5, stl:0.0, blk:0.0 },
      { name:"Adrian Smith", pos:["SG"], pts:12.0, reb:3.0, ast:3.0, stl:0.0, blk:0.0 },
    ]},
    "76ers":     { colors:["#006BB6","#ED174C"], players:[
      { name:"Wilt Chamberlain", pos:["C"], pts:33.5, reb:24.2, ast:6.8, stl:0.0, blk:0.0 },
      { name:"Hal Greer", pos:["SG","PG"], pts:22.1, reb:5.2, ast:4.4, stl:0.0, blk:0.0 },
      { name:"Chet Walker", pos:["SF"], pts:17.5, reb:8.1, ast:2.0, stl:0.0, blk:0.0 },
      { name:"Billy Cunningham", pos:["SF","PF"], pts:18.5, reb:9.0, ast:3.0, stl:0.0, blk:0.0 },
      { name:"Luke Jackson", pos:["PF","C"], pts:12.0, reb:12.0, ast:2.5, stl:0.0, blk:0.0 },
    ]},
    "Hawks":     { colors:["#E03A3E","#C1D32F"], players:[
      { name:"Bob Pettit", pos:["PF","C"], pts:26.4, reb:16.2, ast:3.0, stl:0.0, blk:0.0 },
      { name:"Lenny Wilkens", pos:["PG"], pts:18.0, reb:4.5, ast:6.5, stl:0.0, blk:0.0 },
      { name:"Zelmo Beaty", pos:["C"], pts:17.0, reb:11.5, ast:1.5, stl:0.0, blk:0.0 },
      { name:"Bill Bridges", pos:["PF","SF"], pts:11.0, reb:12.5, ast:2.5, stl:0.0, blk:0.0 },
      { name:"Richie Guerin", pos:["SG","PG"], pts:18.0, reb:4.0, ast:5.0, stl:0.0, blk:0.0 },
    ]},
  },
  "1970s": {
    "Lakers":    { colors:["#552583","#FDB927"], players:[
      { name:"Jerry West", pos:["PG","SG"], pts:25.8, reb:4.6, ast:8.4, stl:2.6, blk:0.7 },
      { name:"Gail Goodrich", pos:["SG"], pts:21.0, reb:3.0, ast:4.7, stl:1.4, blk:0.2 },
      { name:"Wilt Chamberlain", pos:["C"], pts:20.7, reb:19.2, ast:4.1, stl:0.0, blk:3.0 },
      { name:"Jim McMillian", pos:["SF"], pts:18.8, reb:6.5, ast:3.0, stl:1.1, blk:0.3 },
      { name:"Happy Hairston", pos:["PF"], pts:13.1, reb:13.0, ast:1.9, stl:0.7, blk:0.5 },
      { name:"Pat Riley", pos:["SG"], pts:6.7, reb:1.6, ast:1.6, stl:0.5, blk:0.1 },
    ]},
    "Bucks":     { colors:["#00471B","#EEE1C6"], players:[
      { name:"Kareem Abdul-Jabbar", pos:["C"], pts:30.4, reb:16.0, ast:4.3, stl:1.0, blk:3.5 },
      { name:"Oscar Robertson", pos:["PG","SG"], pts:19.4, reb:6.4, ast:8.2, stl:1.6, blk:0.2 },
      { name:"Bob Dandridge", pos:["SF","PF"], pts:18.4, reb:7.4, ast:3.0, stl:1.2, blk:0.5 },
      { name:"Jon McGlocklin", pos:["SG"], pts:15.8, reb:3.2, ast:3.5, stl:0.9, blk:0.1 },
      { name:"Lucius Allen", pos:["PG"], pts:13.4, reb:3.4, ast:4.4, stl:1.3, blk:0.2 },
    ]},
    "Celtics":   { colors:["#007A33","#BA9653"], players:[
      { name:"John Havlicek", pos:["SG","SF"], pts:28.9, reb:9.0, ast:7.5, stl:1.4, blk:0.3 },
      { name:"Dave Cowens", pos:["C"], pts:20.5, reb:16.2, ast:4.6, stl:1.1, blk:1.0 },
      { name:"Jo Jo White", pos:["PG"], pts:21.3, reb:4.0, ast:5.6, stl:1.5, blk:0.2 },
      { name:"Paul Silas", pos:["PF"], pts:11.7, reb:13.0, ast:2.7, stl:0.9, blk:0.4 },
      { name:"Don Chaney", pos:["SG"], pts:11.6, reb:4.3, ast:3.1, stl:1.9, blk:0.5 },
    ]},
    "Knicks":    { colors:["#006BB6","#F58426"], players:[
      { name:"Walt Frazier", pos:["PG","SG"], pts:23.2, reb:6.1, ast:6.3, stl:2.0, blk:0.2 },
      { name:"Willis Reed", pos:["C"], pts:18.7, reb:13.9, ast:2.0, stl:0.0, blk:0.0 },
      { name:"Earl Monroe", pos:["SG"], pts:17.5, reb:3.0, ast:4.0, stl:1.2, blk:0.1 },
      { name:"Dave DeBusschere", pos:["PF"], pts:16.0, reb:11.0, ast:3.0, stl:1.1, blk:0.5 },
      { name:"Bill Bradley", pos:["SF"], pts:12.4, reb:3.3, ast:4.0, stl:0.8, blk:0.1 },
    ]},
    "Warriors":  { colors:["#1D428A","#FFC72C"], players:[
      { name:"Rick Barry", pos:["SF"], pts:30.6, reb:6.1, ast:4.9, stl:2.9, blk:0.5 },
      { name:"Nate Thurmond", pos:["C"], pts:17.4, reb:17.7, ast:3.0, stl:0.9, blk:2.6 },
      { name:"Jeff Mullins", pos:["SG","PG"], pts:16.2, reb:4.0, ast:4.4, stl:1.2, blk:0.2 },
      { name:"Cazzie Russell", pos:["SF"], pts:20.3, reb:4.4, ast:3.1, stl:1.0, blk:0.2 },
      { name:"Clyde Lee", pos:["PF"], pts:9.0, reb:11.0, ast:1.4, stl:0.6, blk:0.7 },
    ]},
    "Bulls":     { colors:["#CE1141","#000000"], players:[
      { name:"Bob Love", pos:["SF"], pts:21.0, reb:6.8, ast:2.5, stl:1.0, blk:0.3 },
      { name:"Chet Walker", pos:["SF","PF"], pts:19.0, reb:5.5, ast:2.5, stl:1.0, blk:0.2 },
      { name:"Jerry Sloan", pos:["SG","PG"], pts:14.0, reb:7.0, ast:2.5, stl:2.5, blk:0.2 },
      { name:"Norm Van Lier", pos:["PG"], pts:12.0, reb:5.0, ast:7.0, stl:2.2, blk:0.1 },
      { name:"Tom Boerwinkle", pos:["C"], pts:7.0, reb:9.0, ast:3.0, stl:0.8, blk:0.8 },
    ]},
    "Jazz":      { colors:["#5A2D81","#00471B"], players:[
      { name:"Pete Maravich", pos:["PG","SG"], pts:25.2, reb:4.5, ast:6.0, stl:1.5, blk:0.2 },
      { name:"Truck Robinson", pos:["PF","C"], pts:18.0, reb:12.0, ast:1.8, stl:0.8, blk:0.5 },
      { name:"Gail Goodrich", pos:["PG","SG"], pts:16.0, reb:2.5, ast:5.0, stl:1.2, blk:0.1 },
      { name:"Aaron James", pos:["SF","PF"], pts:13.0, reb:5.0, ast:1.5, stl:0.7, blk:0.3 },
      { name:"Rich Kelley", pos:["C"], pts:9.0, reb:9.0, ast:2.5, stl:0.9, blk:1.3 },
      { name:"Ron Behagen", pos:["PF","C"], pts:11.0, reb:7.0, ast:1.5, stl:0.8, blk:0.7 },
      { name:"Bernie Fryer", pos:["SG","PG"], pts:9.0, reb:2.0, ast:2.5, stl:0.9, blk:0.2 },
      { name:"Fred Boyd", pos:["PG","SG"], pts:8.0, reb:2.0, ast:3.0, stl:0.8, blk:0.1 },
      { name:"E.C. Coleman", pos:["SF","PF"], pts:8.0, reb:6.0, ast:1.5, stl:1.0, blk:0.5 },
      { name:"Otto Moore", pos:["C","PF"], pts:7.0, reb:7.5, ast:1.2, stl:0.7, blk:1.0 },
    ]},
    "Spurs":     { colors:["#000000","#C4CED4"], players:[
      { name:"George Gervin", pos:["SG","SF"], pts:27.0, reb:5.0, ast:3.0, stl:1.2, blk:1.0 },
      { name:"Larry Kenon", pos:["PF","SF"], pts:20.0, reb:10.5, ast:2.5, stl:1.5, blk:0.7 },
      { name:"James Silas", pos:["PG","SG"], pts:16.0, reb:2.5, ast:5.5, stl:1.3, blk:0.1 },
      { name:"Billy Paultz", pos:["C"], pts:13.0, reb:9.0, ast:2.5, stl:0.7, blk:1.5 },
      { name:"Mike Gale", pos:["SG","PG"], pts:10.0, reb:3.5, ast:5.0, stl:2.0, blk:0.3 },
      { name:"Mark Olberding", pos:["PF","C"], pts:10.0, reb:6.0, ast:2.5, stl:0.7, blk:0.4 },
      { name:"Coby Dietrick", pos:["C","PF"], pts:8.0, reb:6.5, ast:1.5, stl:0.6, blk:1.1 },
      { name:"Allan Bristow", pos:["SF","PF"], pts:11.0, reb:5.0, ast:3.5, stl:1.0, blk:0.2 },
      { name:"Louie Dampier", pos:["PG","SG"], pts:9.0, reb:2.0, ast:4.0, stl:0.9, blk:0.1 },
      { name:"Billy McKinney", pos:["PG"], pts:7.0, reb:1.8, ast:3.0, stl:0.8, blk:0.1 },
    ]},
    "Trail Blazers": { colors:["#E03A3E","#000000"], players:[
      { name:"Bill Walton", pos:["C"], pts:18.6, reb:14.4, ast:5.0, stl:1.0, blk:3.2 },
      { name:"Maurice Lucas", pos:["PF","C"], pts:20.0, reb:11.0, ast:2.5, stl:1.0, blk:0.7 },
      { name:"Lionel Hollins", pos:["PG","SG"], pts:15.0, reb:3.0, ast:4.5, stl:2.0, blk:0.3 },
      { name:"Bob Gross", pos:["SF","PF"], pts:11.0, reb:5.0, ast:3.0, stl:1.3, blk:0.8 },
      { name:"Dave Twardzik", pos:["PG","SG"], pts:10.0, reb:2.0, ast:4.0, stl:1.5, blk:0.1 },
      { name:"Lloyd Neal", pos:["PF","C"], pts:9.0, reb:7.0, ast:1.5, stl:0.7, blk:1.0 },
      { name:"Larry Steele", pos:["SG","SF"], pts:9.0, reb:2.5, ast:3.0, stl:1.8, blk:0.2 },
      { name:"Johnny Davis", pos:["PG","SG"], pts:8.0, reb:2.0, ast:3.0, stl:1.0, blk:0.2 },
      { name:"Corky Calhoun", pos:["SF","PF"], pts:6.0, reb:3.5, ast:1.5, stl:0.8, blk:0.4 },
      { name:"Robin Jones", pos:["C","PF"], pts:5.0, reb:5.0, ast:1.0, stl:0.6, blk:0.7 },
    ]},
    "Bullets":   { colors:["#002B5C","#E31837"], players:[
      { name:"Elvin Hayes", pos:["PF","C"], pts:21.0, reb:12.5, ast:2.0, stl:1.0, blk:2.0 },
      { name:"Wes Unseld", pos:["C"], pts:9.0, reb:14.0, ast:4.0, stl:1.0, blk:0.6 },
      { name:"Phil Chenier", pos:["SG","PG"], pts:19.0, reb:3.5, ast:3.0, stl:1.5, blk:0.4 },
      { name:"Bob Dandridge", pos:["SF","PF"], pts:18.0, reb:6.0, ast:3.5, stl:1.2, blk:0.5 },
      { name:"Kevin Porter", pos:["PG"], pts:12.0, reb:2.5, ast:8.0, stl:1.5, blk:0.1 },
      { name:"Mike Riordan", pos:["SF","SG"], pts:11.0, reb:3.5, ast:3.0, stl:1.0, blk:0.2 },
      { name:"Truck Robinson", pos:["PF","C"], pts:10.0, reb:8.0, ast:1.0, stl:0.6, blk:0.4 },
      { name:"Tom Henderson", pos:["PG","SG"], pts:8.0, reb:2.5, ast:5.0, stl:1.3, blk:0.1 },
      { name:"Dave Bing", pos:["PG","SG"], pts:14.0, reb:3.0, ast:5.5, stl:1.2, blk:0.2 },
      { name:"Larry Wright", pos:["PG","SG"], pts:7.0, reb:1.5, ast:2.5, stl:0.8, blk:0.1 },
    ]},
  },
  "1980s": {
    "Lakers":    { colors:["#552583","#FDB927"], players:[
      { name:"Magic Johnson", pos:["PG","SG","SF"], pts:19.5, reb:7.2, ast:11.2, stl:1.9, blk:0.4 },
      { name:"Kareem Abdul-Jabbar", pos:["C"], pts:21.5, reb:7.2, ast:3.2, stl:0.8, blk:2.6 },
      { name:"James Worthy", pos:["SF"], pts:19.4, reb:5.2, ast:3.0, stl:1.1, blk:0.6 },
      { name:"Byron Scott", pos:["SG"], pts:15.7, reb:3.2, ast:3.0, stl:1.4, blk:0.3 },
      { name:"Michael Cooper", pos:["SG","SF"], pts:8.0, reb:3.2, ast:4.0, stl:1.5, blk:0.7 },
      { name:"Kurt Rambis", pos:["PF"], pts:7.2, reb:7.3, ast:1.5, stl:1.1, blk:0.6 },
    ]},
    "Celtics":   { colors:["#007A33","#BA9653"], players:[
      { name:"Larry Bird", pos:["SF","PF"], pts:24.3, reb:10.0, ast:6.3, stl:1.7, blk:0.8 },
      { name:"Kevin McHale", pos:["PF"], pts:21.0, reb:8.1, ast:2.1, stl:0.4, blk:2.2 },
      { name:"Robert Parish", pos:["C"], pts:16.5, reb:10.1, ast:1.8, stl:0.9, blk:1.5 },
      { name:"Dennis Johnson", pos:["PG"], pts:13.0, reb:3.9, ast:6.4, stl:1.3, blk:0.4 },
      { name:"Danny Ainge", pos:["SG"], pts:11.4, reb:2.7, ast:4.2, stl:1.3, blk:0.1 },
    ]},
    "76ers":     { colors:["#006BB6","#ED174C"], players:[
      { name:"Julius Erving", pos:["SF","PF"], pts:24.4, reb:6.9, ast:4.0, stl:2.0, blk:1.7 },
      { name:"Moses Malone", pos:["C"], pts:24.5, reb:15.3, ast:1.3, stl:1.0, blk:1.5 },
      { name:"Maurice Cheeks", pos:["PG"], pts:12.5, reb:3.0, ast:7.3, stl:2.5, blk:0.4 },
      { name:"Andrew Toney", pos:["SG"], pts:17.0, reb:2.5, ast:5.0, stl:1.2, blk:0.2 },
      { name:"Bobby Jones", pos:["PF"], pts:11.0, reb:5.0, ast:2.5, stl:1.4, blk:1.4 },
    ]},
    "Pistons":   { colors:["#C8102E","#1D42BA"], players:[
      { name:"Isiah Thomas", pos:["PG"], pts:20.6, reb:3.6, ast:9.3, stl:2.0, blk:0.3 },
      { name:"Joe Dumars", pos:["SG"], pts:17.5, reb:2.5, ast:5.0, stl:0.9, blk:0.1 },
      { name:"Bill Laimbeer", pos:["C"], pts:13.5, reb:10.1, ast:2.5, stl:0.7, blk:0.8 },
      { name:"Dennis Rodman", pos:["PF","SF"], pts:8.8, reb:9.0, ast:1.5, stl:0.8, blk:0.8 },
      { name:"Vinnie Johnson", pos:["SG"], pts:12.0, reb:3.0, ast:3.5, stl:0.9, blk:0.2 },
    ]},
    "Bucks":     { colors:["#00471B","#EEE1C6"], players:[
      { name:"Sidney Moncrief", pos:["SG","SF"], pts:20.0, reb:5.5, ast:4.5, stl:1.5, blk:0.4 },
      { name:"Terry Cummings", pos:["PF"], pts:21.0, reb:8.5, ast:2.5, stl:1.3, blk:0.7 },
      { name:"Bob Lanier", pos:["C"], pts:13.5, reb:7.0, ast:3.0, stl:1.0, blk:1.2 },
      { name:"Marques Johnson", pos:["SF"], pts:20.0, reb:6.0, ast:3.5, stl:1.2, blk:0.5 },
      { name:"Paul Pressey", pos:["SF","PG"], pts:14.0, reb:5.0, ast:6.5, stl:1.8, blk:0.6 },
    ]},
    "Rockets":   { colors:["#CE1141","#C4CED4"], players:[
      { name:"Hakeem Olajuwon", pos:["C"], pts:23.5, reb:11.5, ast:1.8, stl:1.9, blk:3.4 },
      { name:"Ralph Sampson", pos:["C","PF"], pts:19.0, reb:10.0, ast:3.0, stl:0.9, blk:2.0 },
      { name:"Rodney McCray", pos:["SF"], pts:13.0, reb:7.0, ast:3.5, stl:1.1, blk:0.7 },
      { name:"Lewis Lloyd", pos:["SG","SF"], pts:16.0, reb:4.5, ast:3.5, stl:1.4, blk:0.2 },
      { name:"John Lucas", pos:["PG"], pts:12.0, reb:2.5, ast:8.0, stl:1.8, blk:0.1 },
    ]},
    "Hawks":     { colors:["#E03A3E","#C1D32F"], players:[
      { name:"Dominique Wilkins", pos:["SF","SG"], pts:30.3, reb:6.0, ast:2.6, stl:1.3, blk:0.6 },
      { name:"Doc Rivers", pos:["PG"], pts:14.0, reb:3.5, ast:9.0, stl:2.0, blk:0.3 },
      { name:"Kevin Willis", pos:["PF","C"], pts:16.0, reb:10.5, ast:1.0, stl:0.8, blk:1.0 },
      { name:"Tree Rollins", pos:["C"], pts:7.0, reb:8.0, ast:1.0, stl:0.6, blk:3.0 },
      { name:"Randy Wittman", pos:["SG","SF"], pts:12.0, reb:2.5, ast:3.0, stl:0.7, blk:0.1 },
      { name:"Spud Webb", pos:["PG"], pts:10.0, reb:2.0, ast:5.0, stl:1.5, blk:0.1 },
      { name:"Cliff Levingston", pos:["PF","SF"], pts:9.0, reb:6.0, ast:1.5, stl:0.9, blk:1.0 },
      { name:"Glenn Rivers", pos:["SG","PG"], pts:9.0, reb:3.0, ast:5.0, stl:1.6, blk:0.2 },
      { name:"Antoine Carr", pos:["PF","C"], pts:10.0, reb:4.0, ast:1.2, stl:0.6, blk:1.2 },
      { name:"Mike McGee", pos:["SG","SF"], pts:11.0, reb:2.5, ast:1.5, stl:0.8, blk:0.2 },
    ]},
  },
  "1990s": {
    "Bulls":     { colors:["#CE1141","#000000"], players:[
      { name:"Michael Jordan", pos:["SG"], pts:30.1, reb:6.2, ast:5.3, stl:2.5, blk:0.8 },
      { name:"Scottie Pippen", pos:["PG","SG","SF"], pts:18.0, reb:6.4, ast:5.0, stl:2.0, blk:0.8 },
      { name:"Dennis Rodman", pos:["PF"], pts:5.5, reb:15.3, ast:2.8, stl:0.6, blk:0.6 },
      { name:"Toni Kukoc", pos:["SF"], pts:13.1, reb:4.0, ast:3.7, stl:1.0, blk:0.5 },
      { name:"Horace Grant", pos:["PF","C"], pts:12.0, reb:8.5, ast:2.5, stl:1.1, blk:1.0 },
      { name:"Steve Kerr", pos:["PG","SG"], pts:8.4, reb:1.6, ast:2.3, stl:0.8, blk:0.1 },
      { name:"Ron Harper", pos:["SG","PG"], pts:7.0, reb:3.0, ast:2.6, stl:1.3, blk:0.4 },
      { name:"Luc Longley", pos:["C"], pts:9.0, reb:5.5, ast:1.8, stl:0.4, blk:1.0 },
      { name:"Bill Cartwright", pos:["C"], pts:8.0, reb:5.5, ast:1.2, stl:0.4, blk:0.5 },
      { name:"B.J. Armstrong", pos:["PG"], pts:10.0, reb:1.7, ast:3.3, stl:0.9, blk:0.1 },
    ]},
    "Jazz":      { colors:["#002B5C","#00471B"], players:[
      { name:"Karl Malone", pos:["PF"], pts:27.4, reb:10.5, ast:3.6, stl:1.4, blk:0.8 },
      { name:"John Stockton", pos:["PG"], pts:14.5, reb:2.8, ast:11.5, stl:2.4, blk:0.2 },
      { name:"Jeff Hornacek", pos:["SG"], pts:14.5, reb:2.7, ast:4.2, stl:1.4, blk:0.2 },
      { name:"Bryon Russell", pos:["SF"], pts:10.0, reb:4.0, ast:1.7, stl:1.3, blk:0.4 },
      { name:"Greg Ostertag", pos:["C"], pts:5.5, reb:7.0, ast:0.6, stl:0.5, blk:2.0 },
      { name:"Jeff Malone", pos:["SG"], pts:14.0, reb:2.5, ast:2.0, stl:0.7, blk:0.2 },
      { name:"Antoine Carr", pos:["PF","C"], pts:9.0, reb:4.0, ast:1.0, stl:0.5, blk:1.0 },
      { name:"Howard Eisley", pos:["PG"], pts:7.0, reb:1.8, ast:3.5, stl:0.8, blk:0.1 },
      { name:"Shandon Anderson", pos:["SG","SF"], pts:6.0, reb:2.5, ast:1.2, stl:0.8, blk:0.2 },
      { name:"Bryon Russell II", pos:["SF","PF"], pts:7.0, reb:3.5, ast:1.2, stl:1.0, blk:0.4 },
    ]},
    "Rockets":   { colors:["#CE1141","#C4CED4"], players:[
      { name:"Hakeem Olajuwon", pos:["C"], pts:27.8, reb:11.1, ast:3.6, stl:1.8, blk:3.7 },
      { name:"Clyde Drexler", pos:["SG","SF"], pts:21.4, reb:6.0, ast:5.5, stl:1.8, blk:0.7 },
      { name:"Robert Horry", pos:["PF","SF"], pts:10.0, reb:5.5, ast:3.0, stl:1.5, blk:1.0 },
      { name:"Kenny Smith", pos:["PG"], pts:12.0, reb:2.2, ast:5.5, stl:1.0, blk:0.1 },
      { name:"Sam Cassell", pos:["PG"], pts:9.5, reb:2.5, ast:4.9, stl:1.2, blk:0.1 },
      { name:"Otis Thorpe", pos:["PF","C"], pts:14.0, reb:8.5, ast:2.0, stl:0.7, blk:0.4 },
      { name:"Vernon Maxwell", pos:["SG","PG"], pts:13.0, reb:2.8, ast:4.0, stl:1.4, blk:0.2 },
      { name:"Mario Elie", pos:["SG","SF"], pts:9.0, reb:3.0, ast:2.5, stl:1.0, blk:0.3 },
      { name:"Matt Bullard", pos:["PF","SF"], pts:6.0, reb:3.0, ast:1.2, stl:0.5, blk:0.3 },
      { name:"Carl Herrera", pos:["PF","C"], pts:7.0, reb:5.0, ast:1.0, stl:0.6, blk:0.5 },
    ]},
    "Suns":      { colors:["#1D1160","#E56020"], players:[
      { name:"Charles Barkley", pos:["SF","PF","C"], pts:25.6, reb:12.2, ast:5.1, stl:1.6, blk:1.0 },
      { name:"Kevin Johnson", pos:["PG"], pts:20.1, reb:3.4, ast:10.1, stl:1.9, blk:0.4 },
      { name:"Dan Majerle", pos:["SG"], pts:16.9, reb:4.6, ast:3.8, stl:1.8, blk:0.4 },
      { name:"Danny Manning", pos:["SF"], pts:17.0, reb:6.6, ast:3.1, stl:1.6, blk:1.2 },
      { name:"Tom Chambers", pos:["PF","SF"], pts:18.0, reb:6.5, ast:2.0, stl:0.9, blk:0.6 },
      { name:"Cedric Ceballos", pos:["SF","PF"], pts:14.0, reb:6.0, ast:1.3, stl:0.8, blk:0.3 },
      { name:"Oliver Miller", pos:["C"], pts:8.0, reb:6.5, ast:2.5, stl:1.0, blk:1.6 },
      { name:"Richard Dumas", pos:["SF"], pts:10.0, reb:4.0, ast:1.5, stl:1.0, blk:0.4 },
      { name:"Negele Knight", pos:["PG"], pts:6.0, reb:1.5, ast:3.0, stl:0.7, blk:0.1 },
      { name:"Mark West", pos:["C"], pts:7.0, reb:6.0, ast:0.5, stl:0.4, blk:1.5 },
    ]},
    "Knicks":    { colors:["#006BB6","#F58426"], players:[
      { name:"Patrick Ewing", pos:["C"], pts:23.0, reb:10.5, ast:2.2, stl:1.0, blk:2.8 },
      { name:"John Starks", pos:["SG"], pts:14.0, reb:3.0, ast:4.0, stl:1.5, blk:0.2 },
      { name:"Charles Oakley", pos:["PF","SF"], pts:11.0, reb:10.5, ast:2.5, stl:1.4, blk:0.4 },
      { name:"Allan Houston", pos:["SG"], pts:15.0, reb:2.8, ast:2.5, stl:0.8, blk:0.2 },
      { name:"Derek Harper", pos:["PG"], pts:14.0, reb:2.8, ast:5.5, stl:1.7, blk:0.2 },
      { name:"Charles Smith", pos:["PF","C"], pts:12.0, reb:6.0, ast:1.5, stl:0.6, blk:1.4 },
      { name:"Anthony Mason", pos:["PF","SF"], pts:10.0, reb:8.0, ast:3.5, stl:0.8, blk:0.4 },
      { name:"Rolando Blackman", pos:["SG"], pts:9.0, reb:2.5, ast:2.0, stl:0.7, blk:0.1 },
      { name:"Greg Anthony", pos:["PG"], pts:7.0, reb:2.0, ast:3.5, stl:1.2, blk:0.1 },
      { name:"Herb Williams", pos:["C","PF"], pts:6.0, reb:5.0, ast:0.8, stl:0.4, blk:1.2 },
    ]},
    "SuperSonics":{ colors:["#00653A","#FFC200"], players:[
      { name:"Gary Payton", pos:["PG"], pts:21.8, reb:4.5, ast:8.7, stl:2.4, blk:0.2 },
      { name:"Shawn Kemp", pos:["PF"], pts:18.7, reb:10.8, ast:2.5, stl:1.2, blk:1.4 },
      { name:"Detlef Schrempf", pos:["SF"], pts:17.0, reb:6.5, ast:4.0, stl:1.0, blk:0.4 },
      { name:"Hersey Hawkins", pos:["SG"], pts:15.0, reb:4.0, ast:3.0, stl:2.0, blk:0.3 },
      { name:"Sam Perkins", pos:["C","PF"], pts:12.0, reb:5.5, ast:1.5, stl:1.0, blk:0.9 },
      { name:"Nate McMillan", pos:["PG","SG"], pts:6.0, reb:4.0, ast:6.0, stl:2.0, blk:0.4 },
      { name:"Vincent Askew", pos:["SF","SG"], pts:8.0, reb:3.0, ast:2.5, stl:0.9, blk:0.3 },
      { name:"Kendall Gill", pos:["SG","SF"], pts:11.0, reb:3.5, ast:2.5, stl:1.4, blk:0.4 },
      { name:"Ervin Johnson", pos:["C"], pts:5.0, reb:6.0, ast:0.6, stl:0.6, blk:1.6 },
      { name:"Nate McMillan II", pos:["PG","SG"], pts:5.0, reb:3.5, ast:5.0, stl:1.8, blk:0.3 },
    ]},
    "Magic":     { colors:["#0077C0","#C4CED4"], players:[
      { name:"Shaquille O'Neal", pos:["C"], pts:27.2, reb:12.5, ast:2.9, stl:0.9, blk:2.8 },
      { name:"Penny Hardaway", pos:["PG","SG"], pts:20.9, reb:4.5, ast:7.2, stl:2.0, blk:0.4 },
      { name:"Nick Anderson", pos:["SG","SF"], pts:15.0, reb:5.5, ast:3.0, stl:1.5, blk:0.5 },
      { name:"Dennis Scott", pos:["SF"], pts:13.0, reb:3.0, ast:2.0, stl:0.9, blk:0.3 },
      { name:"Horace Grant", pos:["PF","C"], pts:13.0, reb:9.5, ast:2.5, stl:1.0, blk:1.0 },
      { name:"Brian Shaw", pos:["PG","SG"], pts:8.0, reb:3.5, ast:5.0, stl:1.0, blk:0.2 },
      { name:"Donald Royal", pos:["SF","PF"], pts:7.0, reb:3.5, ast:1.2, stl:0.7, blk:0.4 },
      { name:"Jeff Turner", pos:["PF","C"], pts:5.0, reb:3.0, ast:1.0, stl:0.4, blk:0.4 },
      { name:"Anthony Bowie", pos:["SG","SF"], pts:7.0, reb:2.5, ast:2.0, stl:0.9, blk:0.2 },
      { name:"Tree Rollins", pos:["C"], pts:3.0, reb:4.0, ast:0.4, stl:0.4, blk:1.5 },
    ]},
    "Pacers":    { colors:["#002D62","#FDBB30"], players:[
      { name:"Reggie Miller", pos:["SG","SF"], pts:21.0, reb:3.0, ast:3.0, stl:1.2, blk:0.3 },
      { name:"Rik Smits", pos:["C"], pts:16.0, reb:6.5, ast:1.5, stl:0.5, blk:1.0 },
      { name:"Mark Jackson", pos:["PG"], pts:10.0, reb:4.0, ast:8.0, stl:1.3, blk:0.1 },
      { name:"Dale Davis", pos:["PF","C"], pts:10.0, reb:9.0, ast:1.0, stl:0.7, blk:1.5 },
      { name:"Antonio Davis", pos:["PF","C"], pts:9.0, reb:7.0, ast:0.8, stl:0.5, blk:1.4 },
      { name:"Derrick McKey", pos:["SF","PF"], pts:10.0, reb:4.5, ast:2.5, stl:1.2, blk:0.7 },
      { name:"Byron Scott", pos:["SG"], pts:8.0, reb:2.5, ast:2.0, stl:0.9, blk:0.2 },
      { name:"Travis Best", pos:["PG"], pts:7.0, reb:1.8, ast:3.5, stl:0.8, blk:0.1 },
      { name:"Jalen Rose", pos:["SF","SG"], pts:9.0, reb:3.0, ast:3.0, stl:0.8, blk:0.3 },
      { name:"Chris Mullin", pos:["SF","SG"], pts:11.0, reb:3.0, ast:2.5, stl:1.2, blk:0.3 },
    ]},
    "Trail Blazers": { colors:["#E03A3E","#000000"], players:[
      { name:"Clyde Drexler", pos:["SG","SF"], pts:25.0, reb:6.5, ast:6.0, stl:2.0, blk:0.7 },
      { name:"Terry Porter", pos:["PG"], pts:17.0, reb:3.5, ast:8.0, stl:1.5, blk:0.2 },
      { name:"Jerome Kersey", pos:["SF","PF"], pts:14.0, reb:7.0, ast:2.5, stl:1.5, blk:1.0 },
      { name:"Buck Williams", pos:["PF","C"], pts:12.0, reb:9.5, ast:1.2, stl:0.7, blk:0.8 },
      { name:"Kevin Duckworth", pos:["C"], pts:14.0, reb:6.5, ast:1.5, stl:0.4, blk:0.6 },
      { name:"Cliff Robinson", pos:["PF","SF"], pts:16.0, reb:5.0, ast:2.0, stl:1.0, blk:1.4 },
      { name:"Rod Strickland", pos:["PG"], pts:13.0, reb:4.0, ast:7.0, stl:1.6, blk:0.1 },
      { name:"Clifford Robinson", pos:["C","PF"], pts:8.0, reb:4.0, ast:1.0, stl:0.6, blk:0.9 },
      { name:"Danny Ainge", pos:["SG","PG"], pts:10.0, reb:2.5, ast:3.5, stl:1.0, blk:0.2 },
      { name:"Mark Bryant", pos:["PF","C"], pts:6.0, reb:4.5, ast:0.8, stl:0.5, blk:0.4 },
    ]},
    "Spurs":     { colors:["#000000","#C4CED4"], players:[
      { name:"David Robinson", pos:["C"], pts:25.0, reb:11.5, ast:3.0, stl:1.5, blk:3.3 },
      { name:"Sean Elliott", pos:["SF","PF"], pts:18.0, reb:5.5, ast:3.0, stl:1.0, blk:0.4 },
      { name:"Avery Johnson", pos:["PG"], pts:11.0, reb:2.5, ast:8.0, stl:1.3, blk:0.1 },
      { name:"Vinny Del Negro", pos:["SG","PG"], pts:12.0, reb:3.0, ast:4.0, stl:1.0, blk:0.2 },
      { name:"Dennis Rodman", pos:["PF","C"], pts:7.0, reb:17.0, ast:2.5, stl:0.8, blk:0.7 },
      { name:"Chuck Person", pos:["SF","PF"], pts:14.0, reb:4.0, ast:2.0, stl:0.8, blk:0.3 },
      { name:"Terry Cummings", pos:["PF","C"], pts:12.0, reb:6.5, ast:1.5, stl:1.0, blk:0.5 },
      { name:"Willie Anderson", pos:["SG","SF"], pts:11.0, reb:3.5, ast:4.0, stl:1.2, blk:0.5 },
      { name:"J.R. Reid", pos:["PF","C"], pts:8.0, reb:5.0, ast:1.0, stl:0.6, blk:0.6 },
      { name:"Doc Rivers", pos:["PG","SG"], pts:8.0, reb:2.5, ast:4.0, stl:1.4, blk:0.2 },
    ]},
    "Lakers":    { colors:["#552583","#FDB927"], players:[
      { name:"Shaquille O'Neal", pos:["C"], pts:27.0, reb:12.0, ast:3.1, stl:0.7, blk:2.6 },
      { name:"Eddie Jones", pos:["SG","SF"], pts:17.0, reb:4.0, ast:3.0, stl:2.0, blk:0.7 },
      { name:"Nick Van Exel", pos:["PG"], pts:15.0, reb:3.0, ast:7.0, stl:1.0, blk:0.2 },
      { name:"Cedric Ceballos", pos:["SF","PF"], pts:18.0, reb:7.0, ast:1.5, stl:1.0, blk:0.3 },
      { name:"Elden Campbell", pos:["C","PF"], pts:12.0, reb:6.0, ast:1.5, stl:0.8, blk:2.0 },
      { name:"Kobe Bryant", pos:["SG","SF"], pts:15.0, reb:3.5, ast:2.5, stl:1.0, blk:0.5 },
      { name:"Robert Horry", pos:["PF","SF"], pts:8.0, reb:5.0, ast:2.5, stl:1.2, blk:1.0 },
      { name:"Rick Fox", pos:["SF","SG"], pts:8.0, reb:3.5, ast:2.5, stl:1.0, blk:0.4 },
      { name:"Derek Fisher", pos:["PG"], pts:6.0, reb:2.0, ast:3.0, stl:1.0, blk:0.1 },
      { name:"Sam Perkins", pos:["PF","C"], pts:9.0, reb:4.5, ast:1.2, stl:0.8, blk:0.8 },
    ]},
    "Hornets":   { colors:["#1D1160","#00788C"], players:[
      { name:"Larry Johnson", pos:["PF","SF"], pts:19.0, reb:9.5, ast:3.5, stl:1.0, blk:0.4 },
      { name:"Alonzo Mourning", pos:["C"], pts:21.0, reb:10.0, ast:1.0, stl:0.7, blk:3.0 },
      { name:"Mugsy Bogues", pos:["PG"], pts:9.0, reb:3.0, ast:8.5, stl:1.7, blk:0.0 },
      { name:"Dell Curry", pos:["SG","SF"], pts:14.0, reb:2.5, ast:2.0, stl:1.2, blk:0.3 },
      { name:"Kendall Gill", pos:["SG","SF"], pts:14.0, reb:4.0, ast:3.0, stl:1.6, blk:0.5 },
      { name:"Glen Rice", pos:["SF","SG"], pts:21.0, reb:4.5, ast:2.0, stl:1.0, blk:0.2 },
      { name:"Hersey Hawkins", pos:["SG"], pts:13.0, reb:3.5, ast:3.0, stl:1.5, blk:0.3 },
      { name:"Anthony Mason", pos:["PF","C"], pts:14.0, reb:9.0, ast:4.5, stl:0.9, blk:0.4 },
      { name:"Matt Geiger", pos:["C","PF"], pts:11.0, reb:7.0, ast:1.0, stl:0.6, blk:0.9 },
      { name:"Bobby Phills", pos:["SG","SF"], pts:11.0, reb:3.5, ast:2.5, stl:1.5, blk:0.3 },
    ]},
  },
  "2000s": {
    "Lakers":    { colors:["#552583","#FDB927"], players:[
      { name:"Kobe Bryant", pos:["SG","SF"], pts:28.5, reb:5.6, ast:5.0, stl:1.6, blk:0.5 },
      { name:"Shaquille O'Neal", pos:["C"], pts:27.5, reb:11.8, ast:3.1, stl:0.6, blk:2.4 },
      { name:"Pau Gasol", pos:["PF"], pts:18.8, reb:9.6, ast:3.3, stl:0.5, blk:1.7 },
      { name:"Derek Fisher", pos:["PG"], pts:11.0, reb:2.3, ast:3.5, stl:1.3, blk:0.1 },
      { name:"Lamar Odom", pos:["SF","PF"], pts:14.8, reb:9.2, ast:3.7, stl:1.0, blk:1.0 },
      { name:"Robert Horry", pos:["PF","SF"], pts:7.0, reb:5.0, ast:2.3, stl:1.0, blk:1.0 },
      { name:"Rick Fox", pos:["SF","SG"], pts:9.0, reb:4.0, ast:2.5, stl:1.0, blk:0.4 },
      { name:"Ron Harper", pos:["PG","SG"], pts:7.0, reb:3.0, ast:3.0, stl:1.2, blk:0.4 },
      { name:"Devean George", pos:["SF","PF"], pts:6.0, reb:3.5, ast:1.0, stl:0.7, blk:0.5 },
      { name:"Brian Shaw", pos:["PG","SG"], pts:6.0, reb:3.0, ast:3.5, stl:0.8, blk:0.2 },
    ]},
    "Spurs":     { colors:["#C4CED4","#000000"], players:[
      { name:"Tim Duncan", pos:["PF","C"], pts:21.3, reb:11.6, ast:3.2, stl:0.7, blk:2.3 },
      { name:"Tony Parker", pos:["PG"], pts:18.3, reb:3.2, ast:6.0, stl:1.0, blk:0.1 },
      { name:"Manu Ginobili", pos:["SG","SF"], pts:16.0, reb:4.0, ast:4.0, stl:1.6, blk:0.4 },
      { name:"Bruce Bowen", pos:["SF"], pts:6.5, reb:3.0, ast:1.6, stl:1.0, blk:0.4 },
      { name:"David Robinson", pos:["C"], pts:14.5, reb:8.5, ast:1.7, stl:1.2, blk:2.5 },
      { name:"Robert Horry", pos:["PF","C"], pts:6.0, reb:4.5, ast:2.0, stl:0.9, blk:0.9 },
      { name:"Michael Finley", pos:["SG","SF"], pts:10.0, reb:3.5, ast:2.0, stl:0.8, blk:0.2 },
      { name:"Brent Barry", pos:["SG","SF"], pts:8.0, reb:3.0, ast:3.0, stl:0.9, blk:0.3 },
      { name:"Fabricio Oberto", pos:["C","PF"], pts:5.0, reb:5.0, ast:1.5, stl:0.5, blk:0.4 },
      { name:"Nazr Mohammed", pos:["C","PF"], pts:6.0, reb:5.5, ast:0.5, stl:0.5, blk:0.7 },
    ]},
    "Pistons":   { colors:["#C8102E","#1D42BA"], players:[
      { name:"Chauncey Billups", pos:["PG"], pts:16.5, reb:3.0, ast:6.2, stl:1.1, blk:0.2 },
      { name:"Richard Hamilton", pos:["SG"], pts:19.0, reb:3.5, ast:4.0, stl:1.0, blk:0.2 },
      { name:"Tayshaun Prince", pos:["SF"], pts:14.0, reb:5.0, ast:3.0, stl:0.9, blk:0.7 },
      { name:"Rasheed Wallace", pos:["PF"], pts:14.5, reb:7.0, ast:1.8, stl:1.0, blk:1.6 },
      { name:"Ben Wallace", pos:["C"], pts:7.0, reb:11.0, ast:1.5, stl:1.4, blk:2.3 },
      { name:"Lindsey Hunter", pos:["PG","SG"], pts:7.0, reb:2.0, ast:3.0, stl:1.3, blk:0.2 },
      { name:"Antonio McDyess", pos:["PF","C"], pts:10.0, reb:8.0, ast:1.5, stl:0.7, blk:1.2 },
      { name:"Mehmet Okur", pos:["C","PF"], pts:9.0, reb:5.5, ast:1.3, stl:0.5, blk:0.7 },
      { name:"Corliss Williamson", pos:["PF","SF"], pts:8.0, reb:3.5, ast:1.0, stl:0.6, blk:0.3 },
      { name:"Chucky Atkins", pos:["PG","SG"], pts:8.0, reb:1.8, ast:3.0, stl:0.7, blk:0.1 },
    ]},
    "Cavaliers": { colors:["#860038","#FDBB30"], players:[
      { name:"LeBron James", pos:["SF","PF","SG","PG"], pts:28.4, reb:7.0, ast:7.2, stl:1.7, blk:0.9 },
      { name:"Zydrunas Ilgauskas", pos:["C"], pts:14.0, reb:8.5, ast:1.3, stl:0.5, blk:1.8 },
      { name:"Mo Williams", pos:["PG"], pts:17.8, reb:3.4, ast:4.1, stl:1.0, blk:0.1 },
      { name:"Anderson Varejao", pos:["PF"], pts:8.5, reb:7.5, ast:1.2, stl:1.0, blk:0.6 },
      { name:"Delonte West", pos:["SG","PG"], pts:11.0, reb:3.0, ast:3.5, stl:1.1, blk:0.4 },
      { name:"Drew Gooden", pos:["PF","C"], pts:12.0, reb:8.0, ast:1.0, stl:0.7, blk:0.7 },
      { name:"Larry Hughes", pos:["SG","PG"], pts:15.0, reb:4.0, ast:4.0, stl:1.8, blk:0.4 },
      { name:"Sasha Pavlovic", pos:["SG","SF"], pts:9.0, reb:3.0, ast:1.5, stl:0.8, blk:0.3 },
      { name:"Daniel Gibson", pos:["PG","SG"], pts:8.0, reb:2.0, ast:2.5, stl:0.6, blk:0.1 },
      { name:"Ben Wallace", pos:["C","PF"], pts:6.0, reb:9.0, ast:1.0, stl:1.2, blk:1.8 },
    ]},
    "Mavericks": { colors:["#00538C","#002B5E"], players:[
      { name:"Dirk Nowitzki", pos:["PF","C"], pts:24.6, reb:8.7, ast:2.8, stl:0.9, blk:0.9 },
      { name:"Jason Kidd", pos:["PG"], pts:10.0, reb:6.0, ast:9.0, stl:1.8, blk:0.3 },
      { name:"Josh Howard", pos:["SF"], pts:17.0, reb:6.5, ast:2.0, stl:1.3, blk:0.7 },
      { name:"Jason Terry", pos:["SG","PG"], pts:17.0, reb:2.5, ast:4.0, stl:1.2, blk:0.2 },
      { name:"Erick Dampier", pos:["C"], pts:8.0, reb:8.0, ast:0.8, stl:0.5, blk:1.3 },
      { name:"Michael Finley", pos:["SG","SF"], pts:19.0, reb:5.0, ast:3.4, stl:1.1, blk:0.3 },
      { name:"Jerry Stackhouse", pos:["SG","SF"], pts:13.0, reb:3.0, ast:3.0, stl:0.9, blk:0.3 },
      { name:"Devin Harris", pos:["PG","SG"], pts:13.0, reb:2.5, ast:4.5, stl:1.3, blk:0.3 },
      { name:"DeSagana Diop", pos:["C"], pts:3.0, reb:5.0, ast:0.4, stl:0.4, blk:1.6 },
      { name:"Marquis Daniels", pos:["SG","SF"], pts:8.0, reb:3.0, ast:2.0, stl:0.9, blk:0.3 },
    ]},
    "Suns":      { colors:["#1D1160","#E56020"], players:[
      { name:"Steve Nash", pos:["PG"], pts:18.6, reb:3.5, ast:11.0, stl:0.8, blk:0.1 },
      { name:"Amar'e Stoudemire", pos:["PF","C"], pts:25.2, reb:9.6, ast:1.6, stl:1.0, blk:1.6 },
      { name:"Shawn Marion", pos:["SF","PF"], pts:19.0, reb:10.0, ast:2.0, stl:2.0, blk:1.5 },
      { name:"Joe Johnson", pos:["SG"], pts:17.0, reb:4.5, ast:4.0, stl:1.1, blk:0.3 },
      { name:"Raja Bell", pos:["SG","SF"], pts:14.7, reb:3.2, ast:2.5, stl:1.4, blk:0.2 },
      { name:"Leandro Barbosa", pos:["SG","PG"], pts:13.0, reb:2.5, ast:3.0, stl:1.0, blk:0.2 },
      { name:"Boris Diaw", pos:["PF","C"], pts:10.0, reb:5.0, ast:5.0, stl:0.8, blk:0.6 },
      { name:"Quentin Richardson", pos:["SG","SF"], pts:14.0, reb:6.0, ast:2.0, stl:1.0, blk:0.3 },
      { name:"Kurt Thomas", pos:["C","PF"], pts:6.0, reb:7.0, ast:1.0, stl:0.7, blk:0.8 },
      { name:"James Jones", pos:["SF","SG"], pts:6.0, reb:2.5, ast:0.8, stl:0.6, blk:0.5 },
    ]},
    "Kings":     { colors:["#5A2D81","#63727A"], players:[
      { name:"Chris Webber", pos:["PF","C"], pts:23.0, reb:10.5, ast:4.8, stl:1.4, blk:1.6 },
      { name:"Mike Bibby", pos:["PG"], pts:16.0, reb:3.5, ast:5.0, stl:1.2, blk:0.2 },
      { name:"Peja Stojakovic", pos:["SF","SG"], pts:20.0, reb:5.5, ast:2.0, stl:1.0, blk:0.2 },
      { name:"Vlade Divac", pos:["C"], pts:11.0, reb:8.0, ast:4.0, stl:1.0, blk:1.3 },
      { name:"Doug Christie", pos:["SG","SF"], pts:12.0, reb:4.0, ast:4.5, stl:1.8, blk:0.5 },
      { name:"Hedo Turkoglu", pos:["SF","PF"], pts:10.0, reb:4.0, ast:2.0, stl:1.0, blk:0.3 },
      { name:"Bobby Jackson", pos:["PG","SG"], pts:11.0, reb:3.5, ast:3.0, stl:1.2, blk:0.2 },
      { name:"Brad Miller", pos:["C","PF"], pts:13.0, reb:9.0, ast:3.5, stl:0.9, blk:1.0 },
      { name:"Scot Pollard", pos:["C","PF"], pts:5.0, reb:5.0, ast:0.8, stl:0.5, blk:0.8 },
      { name:"Jon Barry", pos:["SG","PG"], pts:6.0, reb:2.0, ast:2.5, stl:1.0, blk:0.2 },
    ]},
    "Nets":      { colors:["#000000","#777D84"], players:[
      { name:"Jason Kidd", pos:["PG"], pts:14.0, reb:7.0, ast:9.2, stl:2.0, blk:0.3 },
      { name:"Vince Carter", pos:["SG","SF"], pts:24.0, reb:5.8, ast:4.7, stl:1.2, blk:0.6 },
      { name:"Richard Jefferson", pos:["SF","PF"], pts:19.0, reb:5.7, ast:3.0, stl:1.0, blk:0.4 },
      { name:"Kenyon Martin", pos:["PF","C"], pts:16.0, reb:8.3, ast:1.9, stl:1.2, blk:1.2 },
      { name:"Kerry Kittles", pos:["SG","SF"], pts:13.0, reb:4.0, ast:2.5, stl:1.5, blk:0.4 },
      { name:"Lucious Harris", pos:["SG","SF"], pts:9.0, reb:2.5, ast:1.8, stl:0.9, blk:0.2 },
      { name:"Todd MacCulloch", pos:["C"], pts:8.0, reb:6.0, ast:0.7, stl:0.4, blk:1.0 },
      { name:"Aaron Williams", pos:["PF","C"], pts:7.0, reb:5.0, ast:0.8, stl:0.5, blk:1.0 },
      { name:"Brian Scalabrine", pos:["PF","SF"], pts:4.0, reb:3.0, ast:1.0, stl:0.4, blk:0.3 },
      { name:"Anthony Johnson", pos:["PG"], pts:6.0, reb:2.0, ast:3.0, stl:0.7, blk:0.1 },
    ]},
    "Celtics":   { colors:["#007A33","#BA9653"], players:[
      { name:"Paul Pierce", pos:["SF","SG"], pts:21.0, reb:5.6, ast:4.5, stl:1.3, blk:0.6 },
      { name:"Kevin Garnett", pos:["PF","C"], pts:18.8, reb:9.2, ast:3.4, stl:1.4, blk:1.2 },
      { name:"Ray Allen", pos:["SG","SF"], pts:17.4, reb:3.7, ast:2.9, stl:0.9, blk:0.2 },
      { name:"Rajon Rondo", pos:["PG"], pts:11.0, reb:4.2, ast:8.2, stl:1.9, blk:0.1 },
      { name:"Kendrick Perkins", pos:["C"], pts:8.0, reb:6.1, ast:1.2, stl:0.5, blk:1.5 },
      { name:"James Posey", pos:["SF","PF"], pts:8.0, reb:4.5, ast:1.5, stl:1.1, blk:0.4 },
      { name:"Eddie House", pos:["PG","SG"], pts:7.0, reb:1.5, ast:1.8, stl:0.6, blk:0.1 },
      { name:"Glen Davis", pos:["PF","C"], pts:7.0, reb:4.0, ast:0.9, stl:0.5, blk:0.4 },
      { name:"Tony Allen", pos:["SG","SF"], pts:6.0, reb:2.5, ast:1.2, stl:1.0, blk:0.4 },
      { name:"P.J. Brown", pos:["PF","C"], pts:5.0, reb:5.0, ast:1.0, stl:0.6, blk:0.7 },
    ]},
    "Timberwolves": { colors:["#0C2340","#236192"], players:[
      { name:"Kevin Garnett", pos:["PF","C"], pts:24.0, reb:13.5, ast:5.0, stl:1.5, blk:1.6 },
      { name:"Sam Cassell", pos:["PG"], pts:19.0, reb:3.5, ast:7.3, stl:1.3, blk:0.1 },
      { name:"Latrell Sprewell", pos:["SG","SF"], pts:16.0, reb:4.3, ast:3.2, stl:1.3, blk:0.3 },
      { name:"Wally Szczerbiak", pos:["SF","SG"], pts:14.0, reb:4.0, ast:2.5, stl:0.7, blk:0.2 },
      { name:"Troy Hudson", pos:["PG"], pts:10.0, reb:2.0, ast:4.0, stl:0.8, blk:0.1 },
      { name:"Trenton Hassell", pos:["SG","SF"], pts:8.0, reb:3.0, ast:2.0, stl:1.0, blk:0.3 },
      { name:"Ervin Johnson", pos:["C"], pts:5.0, reb:7.0, ast:0.7, stl:0.6, blk:1.5 },
      { name:"Michael Olowokandi", pos:["C"], pts:6.0, reb:6.0, ast:0.6, stl:0.4, blk:1.2 },
      { name:"Fred Hoiberg", pos:["SG","SF"], pts:7.0, reb:2.5, ast:1.5, stl:0.9, blk:0.2 },
      { name:"Mark Madsen", pos:["PF","C"], pts:3.0, reb:3.5, ast:0.6, stl:0.4, blk:0.3 },
    ]},
    "Heat":      { colors:["#98002E","#F9A01B"], players:[
      { name:"Dwyane Wade", pos:["SG","PG"], pts:24.0, reb:5.0, ast:6.8, stl:1.7, blk:1.1 },
      { name:"Shaquille O'Neal", pos:["C"], pts:22.0, reb:10.0, ast:2.8, stl:0.5, blk:2.3 },
      { name:"Alonzo Mourning", pos:["C"], pts:10.0, reb:5.5, ast:0.5, stl:0.4, blk:2.3 },
      { name:"Udonis Haslem", pos:["PF","C"], pts:11.0, reb:9.0, ast:1.2, stl:0.7, blk:0.5 },
      { name:"Antoine Walker", pos:["PF","SF"], pts:14.0, reb:6.0, ast:3.0, stl:1.0, blk:0.4 },
      { name:"Jason Williams", pos:["PG"], pts:12.0, reb:2.5, ast:5.5, stl:1.0, blk:0.1 },
      { name:"James Posey", pos:["SF","PF"], pts:8.0, reb:5.0, ast:1.5, stl:1.2, blk:0.5 },
      { name:"Gary Payton", pos:["PG","SG"], pts:8.0, reb:3.0, ast:4.0, stl:1.2, blk:0.2 },
      { name:"Eddie Jones", pos:["SG","SF"], pts:12.0, reb:4.0, ast:2.5, stl:1.8, blk:0.6 },
      { name:"Rasual Butler", pos:["SF","SG"], pts:7.0, reb:2.5, ast:1.0, stl:0.7, blk:0.5 },
    ]},
    "Magic":     { colors:["#0077C0","#C4CED4"], players:[
      { name:"Dwight Howard", pos:["C"], pts:20.6, reb:13.8, ast:1.4, stl:0.9, blk:2.7 },
      { name:"Tracy McGrady", pos:["SG","SF"], pts:28.0, reb:6.5, ast:5.5, stl:1.4, blk:0.9 },
      { name:"Hedo Turkoglu", pos:["SF","PF"], pts:16.0, reb:5.0, ast:5.0, stl:1.0, blk:0.4 },
      { name:"Rashard Lewis", pos:["SF","PF"], pts:18.0, reb:5.5, ast:2.5, stl:1.1, blk:0.5 },
      { name:"Jameer Nelson", pos:["PG"], pts:14.0, reb:3.2, ast:5.4, stl:1.1, blk:0.1 },
      { name:"Mickael Pietrus", pos:["SF","SG"], pts:9.0, reb:3.0, ast:1.2, stl:0.9, blk:0.5 },
      { name:"Darko Milicic", pos:["C","PF"], pts:6.0, reb:5.0, ast:1.0, stl:0.5, blk:1.5 },
      { name:"Keith Bogans", pos:["SG","SF"], pts:7.0, reb:2.5, ast:1.5, stl:0.8, blk:0.2 },
      { name:"Marcin Gortat", pos:["C"], pts:5.0, reb:5.0, ast:0.5, stl:0.4, blk:0.8 },
      { name:"J.J. Redick", pos:["SG","PG"], pts:6.0, reb:1.5, ast:1.2, stl:0.4, blk:0.1 },
    ]},
  },
  "2010s": {
    "Warriors":  { colors:["#1D428A","#FFC72C"], players:[
      { name:"Stephen Curry", pos:["PG","SG"], pts:25.3, reb:4.5, ast:6.6, stl:1.7, blk:0.2 },
      { name:"Kevin Durant", pos:["SG","SF","PF"], pts:27.0, reb:7.0, ast:4.8, stl:1.0, blk:1.2 },
      { name:"Klay Thompson", pos:["SG"], pts:19.5, reb:3.5, ast:2.3, stl:0.9, blk:0.5 },
      { name:"Draymond Green", pos:["SF","PF","C"], pts:9.0, reb:7.3, ast:6.9, stl:1.5, blk:1.1 },
      { name:"Andre Iguodala", pos:["SF","SG"], pts:7.0, reb:4.0, ast:3.4, stl:1.1, blk:0.5 },
      { name:"Shaun Livingston", pos:["PG","SG"], pts:6.0, reb:2.0, ast:3.0, stl:0.8, blk:0.3 },
      { name:"Harrison Barnes", pos:["SF","PF"], pts:11.0, reb:4.9, ast:1.5, stl:0.8, blk:0.2 },
      { name:"Andrew Bogut", pos:["C"], pts:6.0, reb:8.0, ast:2.0, stl:0.6, blk:1.6 },
      { name:"Zaza Pachulia", pos:["C","PF"], pts:6.0, reb:5.5, ast:1.5, stl:0.8, blk:0.3 },
      { name:"Leandro Barbosa", pos:["SG","PG"], pts:6.0, reb:1.5, ast:1.5, stl:0.7, blk:0.1 },
    ]},
    "Thunder":   { colors:["#007AC1","#EF3B24"], players:[
      { name:"Russell Westbrook", pos:["PG","SG"], pts:28.1, reb:8.0, ast:10.4, stl:1.8, blk:0.3 },
      { name:"Kevin Durant", pos:["SG","SF","PF"], pts:28.2, reb:7.4, ast:4.0, stl:1.3, blk:1.0 },
      { name:"James Harden", pos:["PG","SG"], pts:16.8, reb:4.1, ast:3.7, stl:1.5, blk:0.5 },
      { name:"Serge Ibaka", pos:["PF"], pts:14.3, reb:8.8, ast:0.5, stl:0.5, blk:3.0 },
      { name:"Kendrick Perkins", pos:["C"], pts:5.0, reb:6.0, ast:1.0, stl:0.3, blk:1.0 },
      { name:"Thabo Sefolosha", pos:["SG","SF"], pts:6.0, reb:4.0, ast:1.5, stl:1.4, blk:0.4 },
      { name:"Reggie Jackson", pos:["PG","SG"], pts:8.0, reb:2.5, ast:3.1, stl:0.7, blk:0.2 },
      { name:"Nick Collison", pos:["PF","C"], pts:5.0, reb:5.0, ast:1.4, stl:0.7, blk:0.4 },
      { name:"Steven Adams", pos:["C"], pts:8.0, reb:7.0, ast:0.8, stl:0.5, blk:1.1 },
      { name:"Jeremy Lamb", pos:["SG","SF"], pts:7.0, reb:2.5, ast:1.0, stl:0.5, blk:0.3 },
    ]},
    "Cavaliers": { colors:["#860038","#FDBB30"], players:[
      { name:"LeBron James", pos:["SF","PF","SG","PG"], pts:27.5, reb:8.6, ast:8.7, stl:1.4, blk:0.6 },
      { name:"Kyrie Irving", pos:["PG"], pts:23.8, reb:3.2, ast:5.8, stl:1.3, blk:0.3 },
      { name:"Kevin Love", pos:["PF"], pts:17.0, reb:10.4, ast:2.5, stl:0.7, blk:0.5 },
      { name:"J.R. Smith", pos:["SG"], pts:12.4, reb:2.8, ast:1.9, stl:1.0, blk:0.3 },
      { name:"Tristan Thompson", pos:["C"], pts:9.0, reb:9.2, ast:0.7, stl:0.5, blk:0.8 },
      { name:"Iman Shumpert", pos:["SG","SF"], pts:7.0, reb:3.0, ast:1.8, stl:1.2, blk:0.3 },
      { name:"Channing Frye", pos:["PF","C"], pts:8.0, reb:4.0, ast:0.9, stl:0.5, blk:0.5 },
      { name:"Matthew Dellavedova", pos:["PG"], pts:6.0, reb:2.0, ast:4.0, stl:0.9, blk:0.1 },
      { name:"Richard Jefferson", pos:["SF","PF"], pts:5.5, reb:2.5, ast:1.2, stl:0.6, blk:0.2 },
      { name:"Timofey Mozgov", pos:["C"], pts:7.0, reb:6.0, ast:0.6, stl:0.4, blk:1.0 },
    ]},
    "Spurs":     { colors:["#C4CED4","#000000"], players:[
      { name:"Kawhi Leonard", pos:["SF","SG"], pts:21.2, reb:6.2, ast:3.0, stl:1.8, blk:0.7 },
      { name:"Tim Duncan", pos:["PF","C"], pts:14.0, reb:9.5, ast:2.5, stl:0.7, blk:1.8 },
      { name:"Tony Parker", pos:["PG"], pts:15.5, reb:2.5, ast:5.5, stl:0.7, blk:0.1 },
      { name:"LaMarcus Aldridge", pos:["PF","C"], pts:18.0, reb:8.5, ast:2.0, stl:0.6, blk:1.2 },
      { name:"Manu Ginobili", pos:["SG"], pts:11.0, reb:3.0, ast:4.0, stl:1.2, blk:0.3 },
      { name:"Danny Green", pos:["SG","SF"], pts:9.0, reb:3.5, ast:1.8, stl:1.0, blk:0.8 },
      { name:"Patty Mills", pos:["PG"], pts:8.0, reb:1.8, ast:2.5, stl:0.8, blk:0.1 },
      { name:"Boris Diaw", pos:["PF","C"], pts:8.0, reb:4.0, ast:3.5, stl:0.6, blk:0.4 },
      { name:"Tiago Splitter", pos:["C","PF"], pts:8.0, reb:5.5, ast:1.2, stl:0.6, blk:0.9 },
      { name:"Kyle Anderson", pos:["SF","PF"], pts:6.0, reb:3.5, ast:2.5, stl:1.1, blk:0.6 },
    ]},
    "Rockets":   { colors:["#CE1141","#C4CED4"], players:[
      { name:"James Harden", pos:["PG","SG"], pts:30.4, reb:6.2, ast:8.1, stl:1.7, blk:0.7 },
      { name:"Chris Paul", pos:["PG"], pts:18.6, reb:5.4, ast:9.8, stl:2.0, blk:0.2 },
      { name:"Clint Capela", pos:["C"], pts:13.9, reb:11.0, ast:1.0, stl:0.8, blk:1.9 },
      { name:"Eric Gordon", pos:["SG"], pts:16.2, reb:2.5, ast:2.5, stl:0.6, blk:0.5 },
      { name:"Trevor Ariza", pos:["SF","PF"], pts:11.0, reb:5.5, ast:2.0, stl:1.6, blk:0.3 },
      { name:"P.J. Tucker", pos:["PF","SF"], pts:7.0, reb:6.0, ast:1.2, stl:1.2, blk:0.5 },
      { name:"Ryan Anderson", pos:["PF","C"], pts:10.0, reb:5.0, ast:1.0, stl:0.5, blk:0.4 },
      { name:"Nene Hilario", pos:["C","PF"], pts:8.0, reb:5.0, ast:1.5, stl:0.7, blk:0.6 },
      { name:"Lou Williams", pos:["SG","PG"], pts:14.0, reb:2.5, ast:3.5, stl:0.9, blk:0.2 },
      { name:"Luc Mbah a Moute", pos:["SF","PF"], pts:7.0, reb:3.0, ast:1.0, stl:1.0, blk:0.5 },
    ]},
    "Heat":      { colors:["#98002E","#F9A01B"], players:[
      { name:"LeBron James", pos:["SF","PF","SG","PG"], pts:27.1, reb:7.9, ast:6.9, stl:1.7, blk:0.8 },
      { name:"Dwyane Wade", pos:["SG"], pts:22.1, reb:4.6, ast:5.0, stl:1.6, blk:0.8 },
      { name:"Chris Bosh", pos:["PF","C"], pts:18.0, reb:7.3, ast:1.8, stl:0.8, blk:0.8 },
      { name:"Ray Allen", pos:["SG"], pts:10.9, reb:2.7, ast:1.7, stl:0.8, blk:0.2 },
      { name:"Mario Chalmers", pos:["PG"], pts:8.6, reb:2.5, ast:3.5, stl:1.5, blk:0.2 },
      { name:"Shane Battier", pos:["SF","PF"], pts:6.0, reb:3.0, ast:1.5, stl:1.0, blk:0.7 },
      { name:"Udonis Haslem", pos:["PF","C"], pts:7.0, reb:7.0, ast:1.0, stl:0.6, blk:0.4 },
      { name:"Norris Cole", pos:["PG"], pts:6.0, reb:2.0, ast:3.0, stl:1.0, blk:0.1 },
      { name:"Chris Andersen", pos:["C","PF"], pts:6.0, reb:5.0, ast:0.5, stl:0.5, blk:1.4 },
      { name:"Mike Miller", pos:["SF","SG"], pts:6.0, reb:4.0, ast:2.0, stl:0.7, blk:0.2 },
    ]},
    "Raptors":   { colors:["#CE1141","#000000"], players:[
      { name:"Kawhi Leonard", pos:["SF","PF"], pts:26.6, reb:7.3, ast:3.3, stl:1.8, blk:0.4 },
      { name:"Kyle Lowry", pos:["PG"], pts:14.2, reb:4.8, ast:8.7, stl:1.4, blk:0.5 },
      { name:"Pascal Siakam", pos:["PF","SF"], pts:16.9, reb:7.0, ast:3.1, stl:0.9, blk:0.7 },
      { name:"DeMar DeRozan", pos:["SG","SF"], pts:23.0, reb:3.9, ast:5.2, stl:1.1, blk:0.3 },
      { name:"Serge Ibaka", pos:["PF","C"], pts:15.0, reb:8.1, ast:1.3, stl:0.4, blk:1.4 },
      { name:"Marc Gasol", pos:["C"], pts:9.0, reb:6.6, ast:3.9, stl:0.9, blk:1.1 },
      { name:"Fred VanVleet", pos:["PG","SG"], pts:11.0, reb:2.6, ast:4.8, stl:1.5, blk:0.3 },
      { name:"Danny Green", pos:["SG","SF"], pts:10.3, reb:4.0, ast:1.6, stl:1.0, blk:0.7 },
      { name:"Norman Powell", pos:["SG","SF"], pts:8.0, reb:2.5, ast:1.5, stl:0.8, blk:0.2 },
      { name:"OG Anunoby", pos:["SF","PF"], pts:7.0, reb:2.9, ast:0.7, stl:0.7, blk:0.3 },
    ]},
    "Celtics":   { colors:["#007A33","#BA9653"], players:[
      { name:"Isaiah Thomas", pos:["PG"], pts:28.9, reb:2.7, ast:5.9, stl:0.9, blk:0.1 },
      { name:"Al Horford", pos:["C","PF"], pts:14.0, reb:6.8, ast:5.0, stl:0.8, blk:1.3 },
      { name:"Jae Crowder", pos:["SF","PF"], pts:14.0, reb:5.8, ast:1.8, stl:1.0, blk:0.3 },
      { name:"Avery Bradley", pos:["SG","PG"], pts:16.3, reb:6.1, ast:2.2, stl:1.2, blk:0.2 },
      { name:"Marcus Smart", pos:["PG","SG"], pts:10.6, reb:4.0, ast:4.6, stl:1.6, blk:0.5 },
      { name:"Jaylen Brown", pos:["SG","SF"], pts:13.0, reb:4.9, ast:1.6, stl:0.8, blk:0.4 },
      { name:"Kelly Olynyk", pos:["C","PF"], pts:9.0, reb:4.8, ast:2.1, stl:0.8, blk:0.5 },
      { name:"Terry Rozier", pos:["PG","SG"], pts:8.0, reb:3.1, ast:2.2, stl:0.9, blk:0.3 },
      { name:"Amir Johnson", pos:["PF","C"], pts:6.4, reb:4.6, ast:1.6, stl:0.6, blk:0.9 },
      { name:"Jonas Jerebko", pos:["PF","SF"], pts:5.0, reb:4.0, ast:1.0, stl:0.5, blk:0.3 },
    ]},
    "Clippers":  { colors:["#C8102E","#1D428A"], players:[
      { name:"Chris Paul", pos:["PG"], pts:18.7, reb:4.5, ast:9.8, stl:2.1, blk:0.2 },
      { name:"Blake Griffin", pos:["PF","C"], pts:21.6, reb:8.4, ast:4.9, stl:0.9, blk:0.5 },
      { name:"DeAndre Jordan", pos:["C"], pts:11.5, reb:13.8, ast:1.2, stl:0.7, blk:2.2 },
      { name:"J.J. Redick", pos:["SG"], pts:16.0, reb:2.0, ast:1.6, stl:0.7, blk:0.2 },
      { name:"Jamal Crawford", pos:["SG","PG"], pts:14.0, reb:1.8, ast:2.3, stl:0.8, blk:0.2 },
      { name:"Matt Barnes", pos:["SF","PF"], pts:10.0, reb:5.0, ast:2.5, stl:1.2, blk:0.4 },
      { name:"Austin Rivers", pos:["SG","PG"], pts:8.0, reb:2.0, ast:2.0, stl:0.6, blk:0.2 },
      { name:"Spencer Hawes", pos:["C","PF"], pts:7.0, reb:5.0, ast:2.3, stl:0.6, blk:0.9 },
      { name:"Wesley Johnson", pos:["SF","PF"], pts:6.0, reb:3.5, ast:1.0, stl:0.8, blk:0.7 },
      { name:"Luc Mbah a Moute", pos:["SF","PF"], pts:5.0, reb:3.5, ast:1.0, stl:1.0, blk:0.5 },
    ]},
    "Trail Blazers": { colors:["#E03A3E","#000000"], players:[
      { name:"Damian Lillard", pos:["PG"], pts:27.0, reb:4.4, ast:6.6, stl:1.0, blk:0.3 },
      { name:"CJ McCollum", pos:["SG","PG"], pts:21.0, reb:3.9, ast:3.6, stl:0.9, blk:0.5 },
      { name:"Jusuf Nurkic", pos:["C"], pts:15.0, reb:10.4, ast:3.2, stl:1.0, blk:1.4 },
      { name:"Al-Farouq Aminu", pos:["SF","PF"], pts:9.4, reb:7.6, ast:1.3, stl:1.0, blk:0.7 },
      { name:"Maurice Harkless", pos:["SF","PF"], pts:8.0, reb:4.4, ast:1.1, stl:1.1, blk:0.8 },
      { name:"Evan Turner", pos:["SF","SG"], pts:9.0, reb:5.0, ast:3.9, stl:0.9, blk:0.3 },
      { name:"Enes Kanter", pos:["C","PF"], pts:14.0, reb:11.0, ast:1.8, stl:0.5, blk:0.5 },
      { name:"Rodney Hood", pos:["SG","SF"], pts:9.0, reb:2.5, ast:1.5, stl:0.7, blk:0.2 },
      { name:"Moe Harkless", pos:["SF"], pts:6.0, reb:3.5, ast:1.0, stl:0.9, blk:0.6 },
      { name:"Meyers Leonard", pos:["C","PF"], pts:6.0, reb:4.0, ast:1.0, stl:0.4, blk:0.5 },
    ]},
    "Grizzlies": { colors:["#5D76A9","#12173F"], players:[
      { name:"Marc Gasol", pos:["C"], pts:17.4, reb:7.4, ast:3.8, stl:0.8, blk:1.5 },
      { name:"Mike Conley", pos:["PG"], pts:17.0, reb:3.1, ast:6.1, stl:1.4, blk:0.3 },
      { name:"Zach Randolph", pos:["PF","C"], pts:16.4, reb:10.5, ast:1.7, stl:0.7, blk:0.3 },
      { name:"Tony Allen", pos:["SG","SF"], pts:9.0, reb:4.4, ast:1.8, stl:1.7, blk:0.4 },
      { name:"Rudy Gay", pos:["SF","PF"], pts:19.0, reb:5.8, ast:2.6, stl:1.5, blk:0.9 },
      { name:"Courtney Lee", pos:["SG","SF"], pts:11.0, reb:3.0, ast:2.0, stl:1.2, blk:0.3 },
      { name:"Jeff Green", pos:["SF","PF"], pts:13.0, reb:4.5, ast:1.6, stl:0.9, blk:0.5 },
      { name:"Vince Carter", pos:["SG","SF"], pts:10.0, reb:3.0, ast:2.0, stl:0.9, blk:0.4 },
      { name:"Beno Udrih", pos:["PG"], pts:7.0, reb:2.0, ast:3.5, stl:0.7, blk:0.1 },
      { name:"Kosta Koufos", pos:["C","PF"], pts:6.0, reb:6.5, ast:0.6, stl:0.5, blk:1.1 },
    ]},
    "Pelicans":  { colors:["#0C2340","#C8102E"], players:[
      { name:"Anthony Davis", pos:["PF","C"], pts:28.0, reb:11.1, ast:2.3, stl:1.3, blk:2.5 },
      { name:"Jrue Holiday", pos:["PG","SG"], pts:19.0, reb:4.5, ast:7.7, stl:1.6, blk:0.8 },
      { name:"DeMarcus Cousins", pos:["C","PF"], pts:25.2, reb:12.9, ast:5.4, stl:1.6, blk:1.6 },
      { name:"Nikola Mirotic", pos:["PF","C"], pts:16.7, reb:8.3, ast:1.4, stl:0.9, blk:1.0 },
      { name:"E'Twaun Moore", pos:["SG","PG"], pts:12.5, reb:2.9, ast:2.3, stl:0.9, blk:0.3 },
      { name:"Rajon Rondo", pos:["PG"], pts:8.3, reb:5.3, ast:8.2, stl:1.4, blk:0.1 },
      { name:"Solomon Hill", pos:["SF","PF"], pts:7.0, reb:4.0, ast:2.3, stl:1.1, blk:0.4 },
      { name:"Dante Cunningham", pos:["PF","SF"], pts:6.5, reb:4.3, ast:0.8, stl:0.8, blk:0.6 },
      { name:"Ian Clark", pos:["SG","PG"], pts:8.0, reb:2.0, ast:1.7, stl:0.6, blk:0.2 },
      { name:"Tim Frazier", pos:["PG"], pts:5.0, reb:2.5, ast:4.0, stl:0.8, blk:0.1 },
    ]},
  },
  "2020s": {
    "Nuggets":   { colors:["#0E2240","#FEC524"], players:[
      { name:"Nikola Jokic", pos:["C"], pts:26.4, reb:12.4, ast:9.0, stl:1.3, blk:0.7 },
      { name:"Jamal Murray", pos:["PG"], pts:21.2, reb:4.1, ast:6.2, stl:1.1, blk:0.3 },
      { name:"Aaron Gordon", pos:["PF","SF"], pts:15.0, reb:6.5, ast:3.5, stl:0.8, blk:0.8 },
      { name:"Michael Porter Jr.", pos:["SF"], pts:17.0, reb:7.0, ast:1.5, stl:0.9, blk:0.6 },
      { name:"K. Caldwell-Pope", pos:["SG"], pts:11.0, reb:2.5, ast:2.4, stl:1.5, blk:0.3 },
      { name:"Russell Westbrook", pos:["PG"], pts:13.0, reb:5.0, ast:6.0, stl:1.1, blk:0.3 },
      { name:"Christian Braun", pos:["SG","SF"], pts:8.0, reb:3.5, ast:1.6, stl:0.7, blk:0.4 },
      { name:"Peyton Watson", pos:["SF","PF"], pts:7.0, reb:3.0, ast:1.0, stl:0.6, blk:1.0 },
      { name:"Zeke Nnaji", pos:["PF","C"], pts:5.0, reb:3.0, ast:0.6, stl:0.4, blk:0.5 },
      { name:"Reggie Jackson", pos:["PG","SG"], pts:10.0, reb:2.6, ast:4.0, stl:0.7, blk:0.2 },
    ]},
    "Bucks":     { colors:["#00471B","#EEE1C6"], players:[
      { name:"Giannis Antetokounmpo", pos:["SF","PF","C"], pts:30.1, reb:11.8, ast:5.9, stl:1.0, blk:1.3 },
      { name:"Damian Lillard", pos:["PG","SG"], pts:24.3, reb:4.4, ast:7.0, stl:1.0, blk:0.3 },
      { name:"Khris Middleton", pos:["SF"], pts:18.0, reb:5.0, ast:5.0, stl:1.1, blk:0.3 },
      { name:"Brook Lopez", pos:["C"], pts:15.0, reb:5.0, ast:1.6, stl:0.5, blk:2.4 },
      { name:"Jrue Holiday", pos:["PG","SG"], pts:15.0, reb:4.5, ast:6.5, stl:1.6, blk:0.6 },
      { name:"Bobby Portis", pos:["PF","C"], pts:14.0, reb:8.0, ast:1.4, stl:0.7, blk:0.4 },
      { name:"Malik Beasley", pos:["SG","SF"], pts:11.0, reb:3.0, ast:1.5, stl:0.7, blk:0.2 },
      { name:"Pat Connaughton", pos:["SG","SF"], pts:7.0, reb:4.0, ast:1.8, stl:0.6, blk:0.3 },
      { name:"George Hill", pos:["PG"], pts:8.0, reb:2.5, ast:3.0, stl:0.9, blk:0.2 },
      { name:"MarJon Beauchamp", pos:["SF","PF"], pts:6.0, reb:3.0, ast:1.0, stl:0.6, blk:0.4 },
    ]},
    "Celtics":   { colors:["#007A33","#BA9653"], players:[
      { name:"Jayson Tatum", pos:["SF","PF"], pts:27.0, reb:8.4, ast:4.9, stl:1.0, blk:0.7 },
      { name:"Jaylen Brown", pos:["SG","SF"], pts:23.0, reb:5.5, ast:3.5, stl:1.1, blk:0.4 },
      { name:"Kristaps Porzingis", pos:["C"], pts:20.0, reb:7.2, ast:2.0, stl:0.7, blk:1.9 },
      { name:"Derrick White", pos:["PG","SG"], pts:15.2, reb:4.2, ast:5.2, stl:1.0, blk:1.0 },
      { name:"Al Horford", pos:["PF","C"], pts:9.0, reb:6.5, ast:3.0, stl:0.6, blk:1.0 },
      { name:"Jrue Holiday", pos:["PG","SG"], pts:12.5, reb:5.4, ast:4.8, stl:0.9, blk:0.8 },
      { name:"Payton Pritchard", pos:["PG"], pts:9.6, reb:3.2, ast:3.4, stl:0.9, blk:0.1 },
      { name:"Sam Hauser", pos:["SF","PF"], pts:9.0, reb:3.5, ast:1.0, stl:0.7, blk:0.3 },
      { name:"Luke Kornet", pos:["C"], pts:6.0, reb:5.0, ast:1.0, stl:0.4, blk:1.0 },
      { name:"Jaden Springer", pos:["SG","PG"], pts:5.0, reb:2.0, ast:1.6, stl:1.0, blk:0.3 },
    ]},
    "Warriors":  { colors:["#1D428A","#FFC72C"], players:[
      { name:"Stephen Curry", pos:["PG","SG"], pts:29.0, reb:5.5, ast:6.3, stl:1.3, blk:0.4 },
      { name:"Klay Thompson", pos:["SG","SF"], pts:18.0, reb:3.8, ast:2.4, stl:0.7, blk:0.4 },
      { name:"Draymond Green", pos:["PF","C"], pts:8.0, reb:7.0, ast:6.8, stl:1.2, blk:0.9 },
      { name:"Andrew Wiggins", pos:["SF"], pts:17.0, reb:4.5, ast:2.2, stl:1.0, blk:0.7 },
      { name:"Jordan Poole", pos:["SG","PG"], pts:18.5, reb:3.4, ast:4.0, stl:0.8, blk:0.3 },
      { name:"Kevon Looney", pos:["C","PF"], pts:7.0, reb:9.3, ast:2.5, stl:0.6, blk:0.6 },
      { name:"Gary Payton II", pos:["PG","SG"], pts:7.1, reb:3.5, ast:1.5, stl:1.4, blk:0.5 },
      { name:"Jonathan Kuminga", pos:["PF","SF"], pts:16.0, reb:4.8, ast:2.2, stl:0.7, blk:0.5 },
      { name:"Moses Moody", pos:["SG","SF"], pts:8.0, reb:2.8, ast:1.0, stl:0.6, blk:0.4 },
      { name:"Andrew Iguodala", pos:["SF","SG"], pts:5.0, reb:3.5, ast:3.4, stl:1.1, blk:0.5 },
    ]},
    "Mavericks": { colors:["#00538C","#002B5E"], players:[
      { name:"Luka Doncic", pos:["PG","SG","SF"], pts:32.4, reb:8.6, ast:8.0, stl:1.4, blk:0.5 },
      { name:"Kyrie Irving", pos:["PG","SG"], pts:25.0, reb:5.0, ast:5.2, stl:1.3, blk:0.5 },
      { name:"P.J. Washington", pos:["PF","SF"], pts:13.0, reb:6.0, ast:2.2, stl:0.9, blk:0.9 },
      { name:"Dereck Lively II", pos:["C"], pts:8.8, reb:7.0, ast:1.1, stl:0.6, blk:1.4 },
      { name:"Derrick Jones Jr.", pos:["SF","PF"], pts:8.6, reb:3.3, ast:1.0, stl:0.8, blk:0.7 },
      { name:"Daniel Gafford", pos:["C"], pts:11.0, reb:7.0, ast:1.4, stl:0.6, blk:2.1 },
      { name:"Tim Hardaway Jr.", pos:["SG","SF"], pts:14.0, reb:3.2, ast:1.8, stl:0.7, blk:0.2 },
      { name:"Josh Green", pos:["SG","SF"], pts:8.0, reb:3.0, ast:2.3, stl:1.0, blk:0.3 },
      { name:"Maxi Kleber", pos:["PF","C"], pts:7.0, reb:5.0, ast:1.5, stl:0.6, blk:0.9 },
      { name:"Jaden Hardy", pos:["PG","SG"], pts:8.0, reb:2.0, ast:1.8, stl:0.5, blk:0.2 },
    ]},
    "76ers":     { colors:["#006BB6","#ED174C"], players:[
      { name:"Joel Embiid", pos:["C"], pts:30.6, reb:11.7, ast:4.2, stl:1.0, blk:1.7 },
      { name:"Tyrese Maxey", pos:["PG","SG"], pts:22.0, reb:3.7, ast:5.3, stl:1.0, blk:0.5 },
      { name:"James Harden", pos:["PG","SG"], pts:21.0, reb:6.1, ast:10.7, stl:1.2, blk:0.6 },
      { name:"Tobias Harris", pos:["SF","PF"], pts:17.2, reb:6.5, ast:3.1, stl:0.9, blk:0.6 },
      { name:"De'Anthony Melton", pos:["SG","PG"], pts:11.0, reb:3.8, ast:3.2, stl:1.6, blk:0.6 },
      { name:"Kelly Oubre Jr.", pos:["SF","SG"], pts:15.4, reb:5.0, ast:1.5, stl:1.0, blk:0.6 },
      { name:"Nicolas Batum", pos:["SF","PF"], pts:6.0, reb:4.0, ast:2.2, stl:0.9, blk:0.7 },
      { name:"Paul Reed", pos:["PF","C"], pts:7.0, reb:6.0, ast:1.2, stl:0.9, blk:0.8 },
      { name:"Kyle Lowry", pos:["PG"], pts:8.0, reb:3.2, ast:4.0, stl:1.0, blk:0.3 },
      { name:"Buddy Hield", pos:["SG","SF"], pts:12.0, reb:3.0, ast:2.5, stl:0.8, blk:0.3 },
      ]},
    "Timberwolves": { colors:["#0C2340","#236192"], players:[
      { name:"Anthony Edwards", pos:["SG","SF"], pts:25.9, reb:5.4, ast:5.1, stl:1.3, blk:0.5 },
      { name:"Karl-Anthony Towns", pos:["C","PF"], pts:21.8, reb:8.3, ast:3.0, stl:0.7, blk:0.7 },
      { name:"Rudy Gobert", pos:["C"], pts:14.0, reb:12.9, ast:1.3, stl:0.7, blk:2.1 },
      { name:"Jaden McDaniels", pos:["SF","PF"], pts:11.0, reb:3.9, ast:1.4, stl:1.0, blk:0.8 },
      { name:"Mike Conley", pos:["PG"], pts:10.0, reb:2.8, ast:5.9, stl:1.0, blk:0.2 },
      { name:"Naz Reid", pos:["C","PF"], pts:13.0, reb:5.2, ast:1.5, stl:0.8, blk:1.0 },
      { name:"Nickeil Alexander-Walker", pos:["SG","PG"], pts:9.0, reb:2.5, ast:2.3, stl:1.0, blk:0.4 },
      { name:"Kyle Anderson", pos:["SF","PF"], pts:6.0, reb:3.5, ast:2.5, stl:0.9, blk:0.6 },
      { name:"Donte DiVincenzo", pos:["SG","PG"], pts:11.0, reb:3.5, ast:2.7, stl:1.1, blk:0.2 },
      { name:"Jaylen Clark", pos:["PG","SG"], pts:5.0, reb:2.0, ast:1.5, stl:1.2, blk:0.2 },
    ]},
    "Suns":      { colors:["#1D1160","#E56020"], players:[
      { name:"Devin Booker", pos:["SG","PG"], pts:27.1, reb:4.5, ast:6.9, stl:0.9, blk:0.4 },
      { name:"Kevin Durant", pos:["PF","SF"], pts:27.1, reb:6.6, ast:5.0, stl:0.9, blk:1.2 },
      { name:"Bradley Beal", pos:["SG","SF"], pts:18.2, reb:4.4, ast:5.0, stl:1.0, blk:0.6 },
      { name:"Jusuf Nurkic", pos:["C"], pts:11.0, reb:11.0, ast:4.0, stl:1.1, blk:1.1 },
      { name:"Grayson Allen", pos:["SG","SF"], pts:13.5, reb:3.9, ast:3.0, stl:0.9, blk:0.3 },
      { name:"Tyus Jones", pos:["PG"], pts:12.0, reb:2.7, ast:7.3, stl:1.0, blk:0.1 },
      { name:"Royce O'Neale", pos:["SF","PF"], pts:7.0, reb:5.0, ast:2.5, stl:1.0, blk:0.5 },
      { name:"Mason Plumlee", pos:["C","PF"], pts:7.0, reb:6.5, ast:2.5, stl:0.6, blk:0.8 },
      { name:"Bol Bol", pos:["C","PF"], pts:6.0, reb:3.5, ast:0.7, stl:0.4, blk:1.2 },
      { name:"Eric Gordon", pos:["SG","PG"], pts:11.0, reb:2.0, ast:2.5, stl:0.7, blk:0.3 },
    ]},
    "Thunder":   { colors:["#007AC1","#EF3B24"], players:[
      { name:"Shai Gilgeous-Alexander", pos:["PG","SG"], pts:30.1, reb:5.5, ast:6.2, stl:2.0, blk:0.9 },
      { name:"Jalen Williams", pos:["SF","SG"], pts:19.1, reb:4.0, ast:4.5, stl:1.1, blk:0.7 },
      { name:"Chet Holmgren", pos:["C","PF"], pts:16.5, reb:7.9, ast:2.4, stl:0.6, blk:2.3 },
      { name:"Luguentz Dort", pos:["SG","SF"], pts:11.0, reb:4.0, ast:1.7, stl:1.1, blk:0.5 },
      { name:"Josh Giddey", pos:["PG","SG"], pts:12.3, reb:6.4, ast:6.2, stl:0.8, blk:0.5 },
      { name:"Isaiah Hartenstein", pos:["C"], pts:7.0, reb:8.3, ast:2.5, stl:1.0, blk:1.1 },
      { name:"Cason Wallace", pos:["PG","SG"], pts:7.0, reb:2.5, ast:1.8, stl:1.4, blk:0.5 },
      { name:"Aaron Wiggins", pos:["SG","SF"], pts:8.0, reb:3.0, ast:1.5, stl:0.7, blk:0.3 },
      { name:"Isaiah Joe", pos:["SG","SF"], pts:8.0, reb:2.5, ast:1.5, stl:0.6, blk:0.3 },
      { name:"Kenrich Williams", pos:["SF","PF"], pts:5.0, reb:3.5, ast:1.8, stl:0.8, blk:0.4 },
    ]},
    "Clippers":  { colors:["#C8102E","#1D428A"], players:[
      { name:"Kawhi Leonard", pos:["SF","PF"], pts:23.7, reb:6.1, ast:3.6, stl:1.6, blk:0.5 },
      { name:"Paul George", pos:["SF","SG"], pts:22.6, reb:5.2, ast:3.5, stl:1.5, blk:0.4 },
      { name:"James Harden", pos:["PG","SG"], pts:16.6, reb:5.1, ast:8.5, stl:1.1, blk:0.6 },
      { name:"Ivica Zubac", pos:["C"], pts:11.7, reb:9.2, ast:1.5, stl:0.5, blk:1.2 },
      { name:"Norman Powell", pos:["SG","SF"], pts:14.0, reb:2.8, ast:2.0, stl:0.9, blk:0.3 },
      { name:"Russell Westbrook", pos:["PG"], pts:11.0, reb:5.0, ast:4.5, stl:1.1, blk:0.4 },
      { name:"Terance Mann", pos:["SG","SF"], pts:8.5, reb:3.5, ast:2.2, stl:0.8, blk:0.3 },
      { name:"Nicolas Batum", pos:["SF","PF"], pts:5.0, reb:4.0, ast:2.0, stl:1.0, blk:0.8 },
      { name:"Bones Hyland", pos:["PG","SG"], pts:8.0, reb:2.0, ast:2.5, stl:0.7, blk:0.2 },
      { name:"Mason Plumlee", pos:["C","PF"], pts:6.0, reb:6.0, ast:2.0, stl:0.6, blk:0.7 },
    ]},
    "Knicks":    { colors:["#006BB6","#F58426"], players:[
      { name:"Jalen Brunson", pos:["PG","SG"], pts:28.7, reb:3.6, ast:6.7, stl:0.9, blk:0.2 },
      { name:"Julius Randle", pos:["PF","SF"], pts:24.0, reb:9.2, ast:5.0, stl:0.8, blk:0.3 },
      { name:"OG Anunoby", pos:["SF","PF"], pts:14.0, reb:4.2, ast:2.0, stl:1.4, blk:0.7 },
      { name:"Mikal Bridges", pos:["SF","SG"], pts:17.0, reb:4.5, ast:3.6, stl:1.0, blk:0.5 },
      { name:"Mitchell Robinson", pos:["C"], pts:7.0, reb:8.5, ast:1.0, stl:0.7, blk:1.5 },
      { name:"Josh Hart", pos:["SG","SF"], pts:9.4, reb:8.3, ast:4.1, stl:1.0, blk:0.3 },
      { name:"Donte DiVincenzo", pos:["SG","PG"], pts:15.5, reb:3.7, ast:2.7, stl:1.2, blk:0.2 },
      { name:"Isaiah Hartenstein", pos:["C","PF"], pts:7.8, reb:8.3, ast:2.5, stl:1.0, blk:1.1 },
      { name:"Miles McBride", pos:["PG","SG"], pts:8.0, reb:2.0, ast:2.5, stl:1.0, blk:0.3 },
      { name:"Precious Achiuwa", pos:["PF","C"], pts:7.0, reb:6.5, ast:1.2, stl:0.7, blk:1.0 },
    ]},
    "Pacers":    { colors:["#002D62","#FDBB30"], players:[
      { name:"Tyrese Haliburton", pos:["PG"], pts:20.1, reb:3.9, ast:10.9, stl:1.2, blk:0.7 },
      { name:"Pascal Siakam", pos:["PF","SF"], pts:21.3, reb:7.8, ast:3.7, stl:0.9, blk:0.6 },
      { name:"Myles Turner", pos:["C","PF"], pts:17.1, reb:6.9, ast:1.3, stl:0.7, blk:1.9 },
      { name:"Bennedict Mathurin", pos:["SG","SF"], pts:16.7, reb:4.0, ast:1.5, stl:0.6, blk:0.3 },
      { name:"Andrew Nembhard", pos:["PG","SG"], pts:10.0, reb:2.7, ast:4.1, stl:1.0, blk:0.3 },
      { name:"Aaron Nesmith", pos:["SF","PF"], pts:12.0, reb:3.8, ast:1.5, stl:0.9, blk:0.5 },
      { name:"T.J. McConnell", pos:["PG"], pts:9.0, reb:2.7, ast:4.4, stl:1.1, blk:0.1 },
      { name:"Obi Toppin", pos:["PF","SF"], pts:10.0, reb:3.9, ast:1.5, stl:0.6, blk:0.5 },
      { name:"Isaiah Jackson", pos:["C","PF"], pts:7.0, reb:5.0, ast:0.8, stl:0.6, blk:1.3 },
      { name:"Ben Sheppard", pos:["SG","SF"], pts:5.0, reb:2.5, ast:1.5, stl:0.7, blk:0.3 },
    ]},
  },
};


// ─── NCAA DATABASE (college careers / peak college season stats only) ──────────
const NCAA_TEAMS = {
  "1970-74": {
    "UCLA": { colors:["#2D68C4","#F2A900"], players:[
      { name:"Bill Walton", pos:["C"], pts:20.3, reb:15.7, ast:5.5, stl:1.5, blk:3.5 },
      { name:"Marques Johnson", pos:["SF","PF"], pts:15.0, reb:8.3, ast:2.0, stl:1.2, blk:0.8 },
      { name:"Jamaal Wilkes", pos:["SF"], pts:15.0, reb:7.4, ast:2.0, stl:1.3, blk:0.6 },
      { name:"Dave Meyers", pos:["PF"], pts:18.3, reb:7.9, ast:2.5, stl:1.0, blk:0.7 },
      { name:"Henry Bibby", pos:["PG","SG"], pts:15.7, reb:3.5, ast:4.0, stl:1.5, blk:0.1 },
      { name:"Richard Washington", pos:["C","PF"], pts:16.0, reb:8.0, ast:1.5, stl:0.8, blk:1.2 },
    ]},
    "Maryland": { colors:["#E03A3E","#FFD520"], players:[
      { name:"Tom McMillen", pos:["PF","SF","C"], pts:20.5, reb:9.8, ast:2.0, stl:0.9, blk:1.5 },
      { name:"Len Elmore", pos:["C"], pts:13.0, reb:11.0, ast:1.5, stl:1.0, blk:2.5 },
      { name:"John Lucas", pos:["PG"], pts:18.3, reb:3.5, ast:6.0, stl:2.0, blk:0.2 },
      { name:"Brad Davis", pos:["PG","SG"], pts:13.0, reb:3.0, ast:5.0, stl:1.8, blk:0.1 },
      { name:"Mo Howard", pos:["SG"], pts:14.0, reb:2.5, ast:3.0, stl:1.3, blk:0.2 },
    ]},
  },
  "1975-79": {
    "Indiana State": { colors:["#0F4D92","#FFFFFF"], players:[
      { name:"Larry Bird", pos:["SF","PF"], pts:28.6, reb:14.9, ast:5.5, stl:1.7, blk:1.4 },
      { name:"Carl Nicks", pos:["SG"], pts:14.0, reb:3.5, ast:3.0, stl:1.4, blk:0.2 },
      { name:"Alex Gilbert", pos:["C"], pts:9.0, reb:8.5, ast:1.0, stl:0.7, blk:2.0 },
      { name:"Brad Miley", pos:["PF"], pts:5.0, reb:5.5, ast:2.0, stl:1.0, blk:0.8 },
      { name:"Steve Reed", pos:["PG"], pts:8.0, reb:2.5, ast:4.5, stl:1.2, blk:0.1 },
    ]},
    "Notre Dame": { colors:["#0C2340","#C99700"], players:[
      { name:"Adrian Dantley", pos:["SF","PF"], pts:25.8, reb:9.8, ast:2.0, stl:1.3, blk:0.5 },
      { name:"Austin Carr", pos:["SG"], pts:34.6, reb:7.0, ast:3.5, stl:1.5, blk:0.3 },
      { name:"John Shumate", pos:["PF","C"], pts:21.0, reb:11.0, ast:2.0, stl:1.0, blk:1.3 },
      { name:"Gary Brokaw", pos:["PG","SG"], pts:17.0, reb:4.0, ast:4.5, stl:1.6, blk:0.2 },
      { name:"Bill Laimbeer", pos:["C"], pts:7.4, reb:6.0, ast:1.0, stl:0.5, blk:1.0 },
    ]},
    "North Carolina": { colors:["#7BAFD4","#FFFFFF"], players:[
      { name:"Phil Ford", pos:["PG"], pts:18.6, reb:2.6, ast:6.1, stl:1.9, blk:0.1 },
      { name:"Mitch Kupchak", pos:["C","PF"], pts:15.3, reb:9.7, ast:1.5, stl:0.9, blk:1.2 },
      { name:"Walter Davis", pos:["SF","SG"], pts:15.7, reb:5.0, ast:3.0, stl:1.4, blk:0.4 },
      { name:"Bobby Jones", pos:["PF"], pts:12.0, reb:8.0, ast:2.0, stl:1.3, blk:1.5 },
      { name:"Tommy LaGarde", pos:["C"], pts:13.0, reb:7.0, ast:1.5, stl:0.7, blk:1.3 },
    ]},
  },
  "1980-84": {
    "Georgetown": { colors:["#041E42","#8D817B"], players:[
      { name:"Patrick Ewing", pos:["C","PF"], pts:15.3, reb:9.2, ast:1.5, stl:1.0, blk:3.4 },
      { name:"Reggie Williams", pos:["SF"], pts:15.0, reb:5.5, ast:2.5, stl:1.5, blk:0.7 },
      { name:"Sleepy Floyd", pos:["SG","PG"], pts:17.7, reb:3.5, ast:4.0, stl:1.8, blk:0.2 },
      { name:"David Wingate", pos:["SG"], pts:12.0, reb:3.5, ast:3.0, stl:1.6, blk:0.4 },
      { name:"Michael Jackson", pos:["PG"], pts:9.0, reb:2.5, ast:6.0, stl:1.5, blk:0.1 },
    ]},
    "North Carolina": { colors:["#7BAFD4","#FFFFFF"], players:[
      { name:"Michael Jordan", pos:["SG","SF"], pts:17.7, reb:5.0, ast:1.8, stl:2.2, blk:0.7 },
      { name:"James Worthy", pos:["SF","PF"], pts:14.5, reb:6.3, ast:2.4, stl:1.6, blk:1.2 },
      { name:"Sam Perkins", pos:["PF","C"], pts:15.9, reb:7.8, ast:1.8, stl:1.0, blk:1.6 },
      { name:"Kenny Smith", pos:["PG"], pts:12.5, reb:2.5, ast:6.0, stl:1.7, blk:0.1 },
      { name:"Brad Daugherty", pos:["C"], pts:14.0, reb:7.5, ast:2.0, stl:0.7, blk:1.0 },
    ]},
    "Houston": { colors:["#C8102E","#FFFFFF"], players:[
      { name:"Hakeem Olajuwon", pos:["C"], pts:16.8, reb:13.5, ast:1.5, stl:1.5, blk:5.6 },
      { name:"Clyde Drexler", pos:["SG","SF"], pts:15.9, reb:8.8, ast:3.3, stl:2.2, blk:1.0 },
      { name:"Larry Micheaux", pos:["PF"], pts:13.0, reb:8.0, ast:1.5, stl:1.2, blk:1.5 },
      { name:"Michael Young", pos:["SF"], pts:17.0, reb:6.0, ast:1.5, stl:1.0, blk:0.5 },
      { name:"Alvin Franklin", pos:["PG"], pts:11.0, reb:2.5, ast:4.0, stl:1.5, blk:0.2 },
    ]},
  },
  "1985-89": {
    "St. John's": { colors:["#BA0C2F","#041E42"], players:[
      { name:"Chris Mullin", pos:["SG","SF"], pts:19.5, reb:4.5, ast:3.5, stl:2.0, blk:0.4 },
      { name:"Walter Berry", pos:["PF"], pts:23.0, reb:11.0, ast:2.5, stl:1.2, blk:1.8 },
      { name:"Mark Jackson", pos:["PG"], pts:11.0, reb:4.0, ast:6.5, stl:2.5, blk:0.1 },
      { name:"Bill Wennington", pos:["C"], pts:11.0, reb:7.0, ast:1.5, stl:0.6, blk:1.2 },
      { name:"Willie Glass", pos:["SF"], pts:10.0, reb:5.5, ast:1.5, stl:1.0, blk:0.5 },
    ]},
    "Indiana": { colors:["#990000","#FFFFFF"], players:[
      { name:"Steve Alford", pos:["SG"], pts:22.0, reb:3.0, ast:3.5, stl:1.5, blk:0.1 },
      { name:"Isiah Thomas", pos:["PG"], pts:16.0, reb:3.1, ast:5.5, stl:2.1, blk:0.2 },
      { name:"Ray Tolbert", pos:["PF","C"], pts:12.0, reb:7.0, ast:1.5, stl:1.0, blk:1.5 },
      { name:"Randy Wittman", pos:["SF","SG"], pts:13.0, reb:3.5, ast:3.0, stl:1.0, blk:0.2 },
      { name:"Uwe Blab", pos:["C"], pts:11.0, reb:6.0, ast:1.5, stl:0.5, blk:1.3 },
    ]},
    "Navy": { colors:["#00205B","#C5B783"], players:[
      { name:"David Robinson", pos:["C"], pts:28.2, reb:11.8, ast:1.6, stl:1.5, blk:4.5 },
      { name:"Vernon Butler", pos:["PF"], pts:11.0, reb:7.0, ast:1.5, stl:1.0, blk:1.0 },
      { name:"Doug Wojcik", pos:["PG"], pts:8.0, reb:2.5, ast:5.0, stl:1.8, blk:0.1 },
      { name:"Cliff Rees", pos:["SG"], pts:9.0, reb:2.5, ast:2.5, stl:1.2, blk:0.2 },
      { name:"Kylor Whitaker", pos:["SF"], pts:10.0, reb:4.0, ast:2.0, stl:1.0, blk:0.4 },
    ]},
  },
  "1990-94": {
    "Michigan": { colors:["#00274C","#FFCB05"], players:[
      { name:"Chris Webber", pos:["PF","C"], pts:19.5, reb:10.1, ast:2.5, stl:1.4, blk:2.5 },
      { name:"Jalen Rose", pos:["SF","PG"], pts:17.0, reb:4.5, ast:4.5, stl:1.5, blk:0.6 },
      { name:"Juwan Howard", pos:["PF","C"], pts:15.0, reb:8.0, ast:2.0, stl:0.8, blk:1.3 },
      { name:"Jimmy King", pos:["SG"], pts:11.0, reb:4.0, ast:3.0, stl:1.4, blk:0.4 },
      { name:"Ray Jackson", pos:["SF"], pts:10.0, reb:4.5, ast:2.5, stl:1.3, blk:0.3 },
    ]},
    "Duke": { colors:["#003087","#FFFFFF"], players:[
      { name:"Christian Laettner", pos:["PF","C"], pts:21.5, reb:7.9, ast:2.0, stl:1.0, blk:1.5 },
      { name:"Grant Hill", pos:["SF","PG"], pts:17.4, reb:6.4, ast:5.2, stl:1.8, blk:1.0 },
      { name:"Bobby Hurley", pos:["PG"], pts:17.0, reb:2.5, ast:7.7, stl:1.8, blk:0.1 },
      { name:"Elton Brand", pos:["PF","C"], pts:17.7, reb:9.8, ast:1.5, stl:1.0, blk:2.5 },
      { name:"Trajan Langdon", pos:["SG"], pts:14.0, reb:3.0, ast:2.5, stl:1.3, blk:0.2 },
    ]},
    "UNLV": { colors:["#CF0A2C","#666666"], players:[
      { name:"Larry Johnson", pos:["PF"], pts:22.7, reb:10.9, ast:2.5, stl:1.5, blk:0.9 },
      { name:"Stacey Augmon", pos:["SF","SG"], pts:14.2, reb:5.5, ast:3.5, stl:2.0, blk:0.8 },
      { name:"Greg Anthony", pos:["PG"], pts:12.0, reb:3.0, ast:7.0, stl:2.5, blk:0.1 },
      { name:"Anderson Hunt", pos:["SG"], pts:15.0, reb:3.0, ast:3.0, stl:1.2, blk:0.2 },
      { name:"George Ackles", pos:["C"], pts:8.0, reb:7.0, ast:0.8, stl:0.8, blk:1.8 },
    ]},
  },
  "1995-99": {
    "Georgetown": { colors:["#041E42","#8D817B"], players:[
      { name:"Allen Iverson", pos:["PG","SG"], pts:23.0, reb:3.8, ast:4.5, stl:3.2, blk:0.4 },
      { name:"Alonzo Mourning", pos:["C"], pts:16.7, reb:8.6, ast:1.0, stl:1.0, blk:3.8 },
      { name:"Dikembe Mutombo", pos:["C"], pts:11.0, reb:9.0, ast:0.8, stl:0.6, blk:3.5 },
      { name:"Othella Harrington", pos:["PF","C"], pts:15.0, reb:8.0, ast:1.0, stl:0.8, blk:1.5 },
      { name:"Jerome Williams", pos:["PF","SF"], pts:10.0, reb:8.5, ast:1.5, stl:1.5, blk:1.0 },
    ]},
    "Arizona": { colors:["#003366","#CC0033"], players:[
      { name:"Mike Bibby", pos:["PG"], pts:17.2, reb:3.5, ast:5.7, stl:1.9, blk:0.1 },
      { name:"Damon Stoudamire", pos:["PG","SG"], pts:18.3, reb:3.5, ast:6.0, stl:1.8, blk:0.1 },
      { name:"Sean Elliott", pos:["SF","PF","C"], pts:19.2, reb:6.0, ast:3.5, stl:1.3, blk:0.6 },
      { name:"Jason Terry", pos:["SG"], pts:16.0, reb:3.5, ast:5.0, stl:2.5, blk:0.2 },
      { name:"Michael Dickerson", pos:["SG","SF"], pts:18.0, reb:4.0, ast:2.5, stl:1.2, blk:0.3 },
    ]},
    "Massachusetts": { colors:["#881C1C","#FFFFFF"], players:[
      { name:"Marcus Camby", pos:["C"], pts:20.5, reb:8.2, ast:1.5, stl:1.5, blk:4.0 },
      { name:"Lou Roe", pos:["PF"], pts:18.0, reb:8.5, ast:2.5, stl:1.3, blk:1.0 },
      { name:"Edgar Padilla", pos:["PG","SG"], pts:8.0, reb:3.0, ast:6.0, stl:2.2, blk:0.1 },
      { name:"Donta Bright", pos:["SF"], pts:14.0, reb:5.5, ast:2.0, stl:1.2, blk:0.5 },
      { name:"Dana Dingle", pos:["SF","PF"], pts:9.0, reb:5.5, ast:1.5, stl:1.3, blk:0.4 },
    ]},
  },
  "2000-04": {
    "Duke": { colors:["#003087","#FFFFFF"], players:[
      { name:"J.J. Redick", pos:["SG"], pts:26.8, reb:2.0, ast:2.6, stl:1.0, blk:0.1 },
      { name:"Shane Battier", pos:["SF","PF"], pts:19.9, reb:7.3, ast:2.3, stl:2.0, blk:2.2 },
      { name:"Jay Williams", pos:["PG"], pts:21.3, reb:3.8, ast:5.3, stl:2.2, blk:0.3 },
      { name:"Carlos Boozer", pos:["PF","C"], pts:18.2, reb:8.7, ast:1.5, stl:0.9, blk:1.3 },
      { name:"Mike Dunleavy", pos:["SF"], pts:17.3, reb:7.2, ast:3.4, stl:1.3, blk:0.7 },
    ]},
    "Syracuse": { colors:["#F76900","#000E54"], players:[
      { name:"Carmelo Anthony", pos:["SF","PF"], pts:22.2, reb:10.0, ast:2.2, stl:1.6, blk:0.8 },
      { name:"Hakim Warrick", pos:["PF"], pts:14.8, reb:8.5, ast:1.0, stl:1.0, blk:2.2 },
      { name:"Gerry McNamara", pos:["PG"], pts:13.3, reb:2.5, ast:4.5, stl:1.5, blk:0.1 },
      { name:"Billy Edelin", pos:["PG","SG"], pts:11.0, reb:3.5, ast:4.0, stl:1.5, blk:0.2 },
      { name:"Craig Forth", pos:["C"], pts:5.0, reb:5.0, ast:0.8, stl:0.5, blk:1.5 },
    ]},
    "Connecticut": { colors:["#000E2F","#E4002B"], players:[
      { name:"Emeka Okafor", pos:["C"], pts:17.6, reb:11.5, ast:1.0, stl:1.0, blk:4.1 },
      { name:"Ben Gordon", pos:["SG","PG"], pts:18.5, reb:4.0, ast:4.5, stl:1.5, blk:0.2 },
      { name:"Caron Butler", pos:["SF"], pts:20.3, reb:7.5, ast:2.5, stl:2.3, blk:1.0 },
      { name:"Rudy Gay", pos:["SF"], pts:15.2, reb:6.4, ast:1.8, stl:1.4, blk:1.5 },
      { name:"Hilton Armstrong", pos:["C","PF"], pts:9.0, reb:6.0, ast:0.8, stl:0.7, blk:2.0 },
    ]},
  },
  "2005-09": {
    "Florida": { colors:["#0021A5","#FA4616"], players:[
      { name:"Joakim Noah", pos:["C","PF"], pts:12.0, reb:8.4, ast:2.2, stl:1.3, blk:2.3 },
      { name:"Al Horford", pos:["PF","C"], pts:13.2, reb:9.5, ast:2.0, stl:0.8, blk:1.8 },
      { name:"Corey Brewer", pos:["SF"], pts:13.5, reb:4.7, ast:2.5, stl:2.1, blk:0.8 },
      { name:"Taurean Green", pos:["PG"], pts:13.0, reb:2.5, ast:4.5, stl:1.5, blk:0.1 },
      { name:"Lee Humphrey", pos:["SG"], pts:10.0, reb:2.0, ast:1.8, stl:1.0, blk:0.1 },
    ]},
    "Ohio State": { colors:["#BB0000","#666666"], players:[
      { name:"Greg Oden", pos:["C","PF"], pts:15.7, reb:9.6, ast:1.0, stl:0.6, blk:3.3 },
      { name:"Mike Conley", pos:["PG"], pts:11.3, reb:3.2, ast:6.1, stl:2.2, blk:0.4 },
      { name:"Evan Turner", pos:["SF","PG"], pts:20.4, reb:9.2, ast:6.0, stl:1.7, blk:0.8 },
      { name:"Daequan Cook", pos:["SG"], pts:11.0, reb:4.0, ast:1.5, stl:1.0, blk:0.3 },
      { name:"Kosta Koufos", pos:["C"], pts:14.0, reb:6.7, ast:0.8, stl:0.6, blk:1.8 },
    ]},
    "Memphis": { colors:["#0C2340","#898D8D"], players:[
      { name:"Derrick Rose", pos:["PG"], pts:14.9, reb:4.5, ast:4.7, stl:1.2, blk:0.4 },
      { name:"Chris Douglas-Roberts", pos:["SG","SF"], pts:18.1, reb:4.5, ast:3.0, stl:1.4, blk:0.4 },
      { name:"Joey Dorsey", pos:["PF","C"], pts:7.0, reb:9.5, ast:1.5, stl:1.0, blk:2.0 },
      { name:"Antonio Anderson", pos:["SG"], pts:10.0, reb:4.0, ast:3.5, stl:1.8, blk:0.4 },
      { name:"Robert Dozier", pos:["PF"], pts:10.0, reb:6.5, ast:1.8, stl:1.0, blk:1.5 },
    ]},
    "Davidson": { colors:["#C8102E","#000000"], players:[
      { name:"Stephen Curry", pos:["PG","SG"], pts:25.3, reb:4.6, ast:5.6, stl:2.5, blk:0.2 },
      { name:"Jason Richards", pos:["PG"], pts:12.0, reb:3.5, ast:7.0, stl:1.8, blk:0.1 },
      { name:"Andrew Lovedale", pos:["PF","SF"], pts:9.0, reb:7.5, ast:1.0, stl:0.8, blk:0.6 },
      { name:"Thomas Sander", pos:["C","PF"], pts:8.0, reb:5.5, ast:1.2, stl:0.6, blk:0.7 },
      { name:"Bryant Barr", pos:["SG"], pts:7.0, reb:2.0, ast:1.5, stl:0.8, blk:0.1 },
    ]},
  },
  "2010-14": {
    "Kentucky": { colors:["#0033A0","#FFFFFF"], players:[
      { name:"Anthony Davis", pos:["PF","SF","C"], pts:14.2, reb:10.4, ast:1.3, stl:1.4, blk:4.7 },
      { name:"John Wall", pos:["PG"], pts:16.6, reb:4.3, ast:6.5, stl:1.8, blk:0.5 },
      { name:"DeMarcus Cousins", pos:["C"], pts:15.1, reb:9.8, ast:1.0, stl:1.0, blk:1.8 },
      { name:"Devin Booker", pos:["SG"], pts:10.0, reb:2.0, ast:1.1, stl:0.8, blk:0.1 },
      { name:"Karl-Anthony Towns", pos:["C","PF"], pts:10.3, reb:6.7, ast:1.1, stl:0.5, blk:2.3 },
    ]},
    "Kansas": { colors:["#0051BA","#E8000D"], players:[
      { name:"Andrew Wiggins", pos:["SF"], pts:17.1, reb:5.9, ast:1.5, stl:1.2, blk:1.0 },
      { name:"Joel Embiid", pos:["C"], pts:11.2, reb:8.1, ast:1.4, stl:0.9, blk:2.6 },
      { name:"Frank Mason III", pos:["PG"], pts:20.9, reb:4.2, ast:5.2, stl:1.3, blk:0.1 },
      { name:"Ben McLemore", pos:["SG"], pts:15.9, reb:5.2, ast:2.0, stl:1.0, blk:0.7 },
      { name:"Thomas Robinson", pos:["PF"], pts:17.7, reb:11.9, ast:1.8, stl:1.1, blk:0.9 },
    ]},
  },
  "2015-19": {
    "Duke": { colors:["#003087","#FFFFFF"], players:[
      { name:"Zion Williamson", pos:["PF","SF"], pts:22.6, reb:8.9, ast:2.1, stl:2.1, blk:1.8 },
      { name:"Jahlil Okafor", pos:["C"], pts:17.3, reb:8.5, ast:1.3, stl:0.8, blk:1.4 },
      { name:"RJ Barrett", pos:["SF","SG"], pts:22.6, reb:7.6, ast:4.3, stl:0.9, blk:0.4 },
      { name:"Jayson Tatum", pos:["SF","PF"], pts:16.8, reb:7.3, ast:2.1, stl:1.3, blk:1.1 },
      { name:"Tyus Jones", pos:["PG"], pts:11.8, reb:3.5, ast:5.6, stl:1.5, blk:0.2 },
    ]},
    "Ohio State": { colors:["#BB0000","#666666"], players:[
      { name:"Jared Sullinger", pos:["PF","C"], pts:17.5, reb:9.2, ast:1.5, stl:1.1, blk:1.2 },
      { name:"D'Angelo Russell", pos:["PG","SG"], pts:19.3, reb:5.7, ast:5.0, stl:1.6, blk:0.5 },
      { name:"Aaron Craft", pos:["PG"], pts:9.0, reb:3.5, ast:4.5, stl:2.5, blk:0.3 },
      { name:"Deshaun Thomas", pos:["SF","PF"], pts:19.8, reb:5.9, ast:1.2, stl:0.8, blk:0.5 },
      { name:"Evan Ravenel", pos:["C"], pts:7.0, reb:5.5, ast:0.8, stl:0.6, blk:0.8 },
    ]},
    "Oklahoma": { colors:["#841617","#FDF9D8"], players:[
      { name:"Buddy Hield", pos:["SG"], pts:25.0, reb:5.7, ast:2.0, stl:1.1, blk:0.4 },
      { name:"Blake Griffin", pos:["PF","C"], pts:22.7, reb:14.4, ast:2.3, stl:1.0, blk:1.2 },
      { name:"Trae Young", pos:["PG"], pts:27.4, reb:3.9, ast:8.7, stl:1.7, blk:0.2 },
      { name:"Willie Warren", pos:["SG","PG"], pts:14.6, reb:4.0, ast:3.0, stl:1.3, blk:0.3 },
      { name:"Taylor Griffin", pos:["SF","PF"], pts:10.0, reb:6.0, ast:1.5, stl:1.0, blk:0.7 },
    ]},
  },
  "2020-24": {
    "Gonzaga": { colors:["#041E42","#C8102E"], players:[
      { name:"Drew Timme", pos:["PF","C"], pts:18.4, reb:7.0, ast:2.8, stl:0.8, blk:0.7 },
      { name:"Jalen Suggs", pos:["PG"], pts:14.4, reb:5.3, ast:4.5, stl:1.9, blk:0.5 },
      { name:"Chet Holmgren", pos:["C"], pts:14.1, reb:9.9, ast:1.9, stl:0.9, blk:3.7 },
      { name:"Corey Kispert", pos:["SF"], pts:18.6, reb:5.0, ast:1.8, stl:0.9, blk:0.3 },
      { name:"Andrew Nembhard", pos:["PG","SG"], pts:9.0, reb:3.5, ast:5.0, stl:1.5, blk:0.2 },
    ]},
    "Iowa": { colors:["#000000","#FFCD00"], players:[
      { name:"Luka Garza", pos:["C"], pts:24.1, reb:8.7, ast:1.6, stl:0.6, blk:1.6 },
      { name:"Joe Wieskamp", pos:["SF","SG"], pts:14.8, reb:6.6, ast:1.9, stl:0.9, blk:0.4 },
      { name:"Jordan Bohannon", pos:["PG"], pts:11.0, reb:3.0, ast:4.0, stl:1.0, blk:0.1 },
      { name:"Keegan Murray", pos:["PF","SF"], pts:23.5, reb:8.7, ast:1.5, stl:1.3, blk:1.9 },
      { name:"CJ Fredrick", pos:["SG"], pts:7.0, reb:2.0, ast:1.5, stl:0.8, blk:0.1 },
    ]},
    "Purdue": { colors:["#CEB888","#000000"], players:[
      { name:"Zach Edey", pos:["C"], pts:22.3, reb:12.9, ast:2.0, stl:0.5, blk:2.2 },
      { name:"Jaden Ivey", pos:["SG","PG"], pts:17.3, reb:4.9, ast:3.1, stl:0.9, blk:0.4 },
      { name:"Braden Smith", pos:["PG"], pts:12.0, reb:4.5, ast:7.2, stl:1.6, blk:0.2 },
      { name:"Fletcher Loyer", pos:["SG"], pts:11.0, reb:2.0, ast:2.5, stl:0.7, blk:0.1 },
      { name:"Mason Gillis", pos:["PF","SF"], pts:7.0, reb:4.5, ast:1.5, stl:0.8, blk:0.4 },
    ]},
    "Alabama": { colors:["#9E1B32","#FFFFFF"], players:[
      { name:"Brandon Miller", pos:["SF","PF"], pts:18.8, reb:8.2, ast:2.1, stl:0.9, blk:0.9 },
      { name:"Mark Sears", pos:["PG"], pts:21.5, reb:4.0, ast:4.0, stl:1.3, blk:0.2 },
      { name:"Collin Sexton", pos:["PG","SG"], pts:19.2, reb:3.8, ast:3.6, stl:0.8, blk:0.4 },
      { name:"Herbert Jones", pos:["SF"], pts:11.0, reb:6.5, ast:3.0, stl:1.8, blk:1.0 },
      { name:"Charles Bediako", pos:["C"], pts:7.0, reb:5.5, ast:0.6, stl:0.4, blk:1.5 },
    ]},
    "UConn": { colors:["#000E2F","#E4002B"], players:[
      { name:"Donovan Clingan", pos:["C"], pts:13.0, reb:7.4, ast:1.5, stl:0.6, blk:2.5 },
      { name:"Tristen Newton", pos:["PG","SG"], pts:15.1, reb:6.9, ast:6.2, stl:1.5, blk:0.3 },
      { name:"Cam Spencer", pos:["SG"], pts:14.3, reb:3.8, ast:3.6, stl:1.7, blk:0.2 },
      { name:"Alex Karaban", pos:["SF","PF"], pts:13.3, reb:5.1, ast:2.3, stl:0.7, blk:0.8 },
      { name:"Stephon Castle", pos:["SG","PG"], pts:11.1, reb:4.7, ast:2.9, stl:1.0, blk:0.5 },
    ]},
    "Baylor": { colors:["#003015","#FFB81C"], players:[
      { name:"Jared Butler", pos:["PG","SG"], pts:16.7, reb:3.3, ast:4.8, stl:2.0, blk:0.3 },
      { name:"Davion Mitchell", pos:["PG"], pts:14.0, reb:2.7, ast:5.5, stl:1.9, blk:0.2 },
      { name:"MaCio Teague", pos:["SG"], pts:15.8, reb:4.4, ast:2.5, stl:1.0, blk:0.3 },
      { name:"Jonathan Tchamwa Tchatchoua", pos:["PF","C"], pts:10.0, reb:6.5, ast:1.2, stl:0.8, blk:0.8 },
      { name:"Mark Vital", pos:["SF","PF"], pts:6.0, reb:6.0, ast:2.0, stl:1.3, blk:0.7 },
    ]},
  },
};


// ─── NFL DATABASE ──────────────────────────────────────────────────────────────
// 12 starting slots: QB RB WR WR TE OL | DL EDGE LB CB S | K
// Five normalized impact categories (0-99): off, def, exp, prot, clu.
// Marquee franchises span multiple 5-year eras so era re-roll always has somewhere to go.
const NFL_TEAMS = {
  "1970-74": {
    "Dolphins":   { colors:["#008E97","#FC4C02"], players:[
      { name:"Bob Griese", pos:["QB"], off:84, def:0, exp:74, prot:30, clu:90 },
      { name:"Larry Csonka", pos:["RB"], off:88, def:0, exp:70, prot:62, clu:90 },
      { name:"Paul Warfield", pos:["WR"], off:88, def:0, exp:92, prot:12, clu:88 },
      { name:"Howard Twilley", pos:["WR"], off:70, def:0, exp:66, prot:10, clu:72 },
      { name:"Jim Mandich", pos:["TE"], off:66, def:0, exp:50, prot:64, clu:64 },
      { name:"Larry Little", pos:["OL"], off:60, def:0, exp:20, prot:94, clu:82 },
      { name:"Manny Fernandez", pos:["DL"], off:0, def:86, exp:68, prot:60, clu:84 },
      { name:"Bill Stanfill", pos:["EDGE"], off:0, def:85, exp:74, prot:42, clu:80 },
      { name:"Nick Buoniconti", pos:["LB"], off:0, def:90, exp:72, prot:50, clu:88 },
      { name:"Tim Foley", pos:["CB"], off:0, def:80, exp:74, prot:18, clu:76 },
      { name:"Jake Scott", pos:["S"], off:0, def:86, exp:76, prot:30, clu:86 },
      { name:"Garo Yepremian", pos:["K"], off:0, def:0, exp:10, prot:0, clu:80 },
    ]},
    "Cowboys":    { colors:["#003594","#869397"], players:[
      { name:"Roger Staubach", pos:["QB"], off:86, def:0, exp:84, prot:35, clu:95 },
      { name:"Calvin Hill", pos:["RB"], off:82, def:0, exp:78, prot:50, clu:78 },
      { name:"Bob Hayes", pos:["WR"], off:84, def:0, exp:97, prot:10, clu:84 },
      { name:"Drew Pearson", pos:["WR"], off:80, def:0, exp:82, prot:10, clu:88 },
      { name:"Billy Joe DuPree", pos:["TE"], off:72, def:0, exp:58, prot:66, clu:70 },
      { name:"Rayfield Wright", pos:["OL"], off:58, def:0, exp:20, prot:93, clu:80 },
      { name:"Bob Lilly", pos:["DL"], off:0, def:95, exp:74, prot:64, clu:92 },
      { name:"Harvey Martin", pos:["EDGE"], off:0, def:86, exp:78, prot:38, clu:84 },
      { name:"Lee Roy Jordan", pos:["LB"], off:0, def:86, exp:64, prot:48, clu:84 },
      { name:"Mel Renfro", pos:["CB"], off:0, def:88, exp:82, prot:18, clu:84 },
      { name:"Cornell Green", pos:["S"], off:0, def:82, exp:72, prot:28, clu:78 },
      { name:"Toni Fritsch", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
    "Steelers":   { colors:["#FFB612","#101820"], players:[
      { name:"Terry Bradshaw", pos:["QB"], off:84, def:0, exp:86, prot:30, clu:90 },
      { name:"Franco Harris", pos:["RB"], off:84, def:0, exp:76, prot:55, clu:86 },
      { name:"Lynn Swann", pos:["WR"], off:82, def:0, exp:90, prot:10, clu:90 },
      { name:"John Stallworth", pos:["WR"], off:82, def:0, exp:84, prot:10, clu:82 },
      { name:"Larry Brown", pos:["TE"], off:64, def:0, exp:46, prot:68, clu:62 },
      { name:"Mike Webster", pos:["OL"], off:60, def:0, exp:20, prot:96, clu:82 },
      { name:"Joe Greene", pos:["DL"], off:0, def:97, exp:72, prot:62, clu:92 },
      { name:"L.C. Greenwood", pos:["EDGE"], off:0, def:89, exp:78, prot:40, clu:84 },
      { name:"Jack Ham", pos:["LB"], off:0, def:93, exp:78, prot:48, clu:90 },
      { name:"Mel Blount", pos:["CB"], off:0, def:93, exp:82, prot:18, clu:88 },
      { name:"Mike Wagner", pos:["S"], off:0, def:82, exp:70, prot:30, clu:80 },
      { name:"Roy Gerela", pos:["K"], off:0, def:0, exp:10, prot:0, clu:78 },
    ]},
    "Vikings":    { colors:["#4F2683","#FFC62F"], players:[
      { name:"Fran Tarkenton", pos:["QB"], off:85, def:0, exp:86, prot:28, clu:86 },
      { name:"Chuck Foreman", pos:["RB"], off:84, def:0, exp:84, prot:52, clu:82 },
      { name:"John Gilliam", pos:["WR"], off:80, def:0, exp:86, prot:10, clu:78 },
      { name:"Sammy White", pos:["WR"], off:74, def:0, exp:82, prot:10, clu:72 },
      { name:"Stu Voigt", pos:["TE"], off:64, def:0, exp:46, prot:62, clu:60 },
      { name:"Ron Yary", pos:["OL"], off:58, def:0, exp:18, prot:93, clu:80 },
      { name:"Alan Page", pos:["DL"], off:0, def:96, exp:84, prot:58, clu:90 },
      { name:"Carl Eller", pos:["EDGE"], off:0, def:91, exp:80, prot:44, clu:86 },
      { name:"Jeff Siemon", pos:["LB"], off:0, def:80, exp:60, prot:46, clu:76 },
      { name:"Bobby Bryant", pos:["CB"], off:0, def:82, exp:78, prot:16, clu:78 },
      { name:"Paul Krause", pos:["S"], off:0, def:90, exp:82, prot:26, clu:86 },
      { name:"Fred Cox", pos:["K"], off:0, def:0, exp:10, prot:0, clu:75 },
    ]},
    "Raiders":    { colors:["#000000","#A5ACAF"], players:[
      { name:"Ken Stabler", pos:["QB"], off:85, def:0, exp:80, prot:30, clu:90 },
      { name:"Marv Hubbard", pos:["RB"], off:76, def:0, exp:60, prot:58, clu:72 },
      { name:"Cliff Branch", pos:["WR"], off:84, def:0, exp:95, prot:10, clu:84 },
      { name:"Fred Biletnikoff", pos:["WR"], off:83, def:0, exp:68, prot:10, clu:90 },
      { name:"Dave Casper", pos:["TE"], off:82, def:0, exp:66, prot:72, clu:86 },
      { name:"Art Shell", pos:["OL"], off:58, def:0, exp:18, prot:95, clu:80 },
      { name:"Otis Sistrunk", pos:["DL"], off:0, def:82, exp:64, prot:54, clu:78 },
      { name:"Ted Hendricks", pos:["EDGE"], off:0, def:91, exp:80, prot:42, clu:88 },
      { name:"Phil Villapiano", pos:["LB"], off:0, def:82, exp:64, prot:46, clu:80 },
      { name:"Willie Brown", pos:["CB"], off:0, def:89, exp:82, prot:18, clu:86 },
      { name:"Jack Tatum", pos:["S"], off:0, def:90, exp:74, prot:32, clu:84 },
      { name:"George Blanda", pos:["K"], off:0, def:0, exp:12, prot:0, clu:88 },
    ]},
  },
  "1975-79": {
    "Steelers":   { colors:["#FFB612","#101820"], players:[
      { name:"Terry Bradshaw", pos:["QB"], off:88, def:0, exp:90, prot:30, clu:95 },
      { name:"Franco Harris", pos:["RB"], off:85, def:0, exp:78, prot:55, clu:88 },
      { name:"Lynn Swann", pos:["WR"], off:84, def:0, exp:92, prot:10, clu:93 },
      { name:"John Stallworth", pos:["WR"], off:83, def:0, exp:85, prot:10, clu:84 },
      { name:"Bennie Cunningham", pos:["TE"], off:70, def:0, exp:55, prot:70, clu:65 },
      { name:"Mike Webster", pos:["OL"], off:60, def:0, exp:20, prot:97, clu:80 },
      { name:"Joe Greene", pos:["DL"], off:0, def:97, exp:70, prot:60, clu:92 },
      { name:"L.C. Greenwood", pos:["EDGE"], off:0, def:90, exp:78, prot:40, clu:85 },
      { name:"Jack Lambert", pos:["LB"], off:0, def:96, exp:72, prot:50, clu:93 },
      { name:"Mel Blount", pos:["CB"], off:0, def:93, exp:80, prot:20, clu:88 },
      { name:"Donnie Shell", pos:["S"], off:0, def:85, exp:65, prot:30, clu:82 },
      { name:"Roy Gerela", pos:["K"], off:0, def:0, exp:10, prot:0, clu:78 },
    ]},
    "Cowboys":    { colors:["#003594","#869397"], players:[
      { name:"Roger Staubach", pos:["QB"], off:87, def:0, exp:85, prot:35, clu:96 },
      { name:"Tony Dorsett", pos:["RB"], off:86, def:0, exp:90, prot:45, clu:84 },
      { name:"Drew Pearson", pos:["WR"], off:82, def:0, exp:84, prot:10, clu:90 },
      { name:"Golden Richards", pos:["WR"], off:72, def:0, exp:80, prot:10, clu:70 },
      { name:"Billy Joe DuPree", pos:["TE"], off:74, def:0, exp:60, prot:68, clu:72 },
      { name:"Rayfield Wright", pos:["OL"], off:58, def:0, exp:20, prot:93, clu:78 },
      { name:"Randy White", pos:["DL"], off:0, def:94, exp:75, prot:62, clu:90 },
      { name:"Harvey Martin", pos:["EDGE"], off:0, def:89, exp:80, prot:38, clu:86 },
      { name:"Thomas Henderson", pos:["LB"], off:0, def:82, exp:78, prot:44, clu:78 },
      { name:"Mel Renfro", pos:["CB"], off:0, def:86, exp:80, prot:18, clu:82 },
      { name:"Cliff Harris", pos:["S"], off:0, def:88, exp:78, prot:30, clu:85 },
      { name:"Rafael Septien", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
    "Raiders":    { colors:["#000000","#A5ACAF"], players:[
      { name:"Ken Stabler", pos:["QB"], off:86, def:0, exp:82, prot:30, clu:93 },
      { name:"Mark van Eeghen", pos:["RB"], off:78, def:0, exp:62, prot:58, clu:74 },
      { name:"Cliff Branch", pos:["WR"], off:85, def:0, exp:95, prot:10, clu:86 },
      { name:"Fred Biletnikoff", pos:["WR"], off:83, def:0, exp:70, prot:10, clu:91 },
      { name:"Dave Casper", pos:["TE"], off:82, def:0, exp:68, prot:72, clu:88 },
      { name:"Art Shell", pos:["OL"], off:58, def:0, exp:18, prot:95, clu:80 },
      { name:"John Matuszak", pos:["DL"], off:0, def:82, exp:65, prot:58, clu:78 },
      { name:"Ted Hendricks", pos:["EDGE"], off:0, def:91, exp:80, prot:42, clu:88 },
      { name:"Phil Villapiano", pos:["LB"], off:0, def:83, exp:66, prot:46, clu:80 },
      { name:"Willie Brown", pos:["CB"], off:0, def:89, exp:82, prot:18, clu:86 },
      { name:"Jack Tatum", pos:["S"], off:0, def:90, exp:75, prot:32, clu:84 },
      { name:"Errol Mann", pos:["K"], off:0, def:0, exp:10, prot:0, clu:75 },
    ]},
    "Broncos":    { colors:["#FB4F14","#002244"], players:[
      { name:"Craig Morton", pos:["QB"], off:78, def:0, exp:66, prot:30, clu:80 },
      { name:"Otis Armstrong", pos:["RB"], off:78, def:0, exp:80, prot:48, clu:74 },
      { name:"Haven Moses", pos:["WR"], off:78, def:0, exp:82, prot:10, clu:78 },
      { name:"Rick Upchurch", pos:["WR"], off:76, def:0, exp:90, prot:10, clu:78 },
      { name:"Riley Odoms", pos:["TE"], off:74, def:0, exp:60, prot:66, clu:72 },
      { name:"Tom Glassic", pos:["OL"], off:54, def:0, exp:16, prot:86, clu:76 },
      { name:"Lyle Alzado", pos:["DL"], off:0, def:86, exp:78, prot:52, clu:82 },
      { name:"Tom Jackson", pos:["EDGE"], off:0, def:84, exp:78, prot:42, clu:82 },
      { name:"Randy Gradishar", pos:["LB"], off:0, def:90, exp:74, prot:50, clu:88 },
      { name:"Louis Wright", pos:["CB"], off:0, def:86, exp:82, prot:16, clu:82 },
      { name:"Billy Thompson", pos:["S"], off:0, def:84, exp:74, prot:30, clu:80 },
      { name:"Jim Turner", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
  },
  "1980-84": {
    "49ers":      { colors:["#AA0000","#B3995D"], players:[
      { name:"Joe Montana", pos:["QB"], off:92, def:0, exp:88, prot:35, clu:99 },
      { name:"Wendell Tyler", pos:["RB"], off:79, def:0, exp:78, prot:48, clu:74 },
      { name:"Dwight Clark", pos:["WR"], off:82, def:0, exp:78, prot:10, clu:92 },
      { name:"Freddie Solomon", pos:["WR"], off:76, def:0, exp:82, prot:10, clu:78 },
      { name:"Russ Francis", pos:["TE"], off:75, def:0, exp:62, prot:70, clu:74 },
      { name:"Randy Cross", pos:["OL"], off:58, def:0, exp:20, prot:90, clu:80 },
      { name:"Fred Dean", pos:["DL"], off:0, def:90, exp:85, prot:50, clu:88 },
      { name:"Dwaine Board", pos:["EDGE"], off:0, def:82, exp:72, prot:40, clu:78 },
      { name:"Jack Reynolds", pos:["LB"], off:0, def:82, exp:60, prot:48, clu:82 },
      { name:"Ronnie Lott", pos:["CB","S"], off:0, def:96, exp:88, prot:30, clu:95 },
      { name:"Dwight Hicks", pos:["S"], off:0, def:84, exp:74, prot:28, clu:80 },
      { name:"Ray Wersching", pos:["K"], off:0, def:0, exp:10, prot:0, clu:80 },
    ]},
    "Redskins":   { colors:["#5A1414","#FFB612"], players:[
      { name:"Joe Theismann", pos:["QB"], off:84, def:0, exp:80, prot:32, clu:86 },
      { name:"John Riggins", pos:["RB"], off:86, def:0, exp:72, prot:60, clu:92 },
      { name:"Art Monk", pos:["WR"], off:85, def:0, exp:80, prot:12, clu:86 },
      { name:"Charlie Brown", pos:["WR"], off:74, def:0, exp:80, prot:10, clu:72 },
      { name:"Don Warren", pos:["TE"], off:68, def:0, exp:50, prot:72, clu:66 },
      { name:"Russ Grimm", pos:["OL"], off:60, def:0, exp:20, prot:94, clu:82 },
      { name:"Dexter Manley", pos:["DL"], off:0, def:87, exp:82, prot:48, clu:82 },
      { name:"Charles Mann", pos:["EDGE"], off:0, def:84, exp:74, prot:42, clu:80 },
      { name:"Mel Kaufman", pos:["LB"], off:0, def:78, exp:58, prot:44, clu:74 },
      { name:"Darrell Green", pos:["CB"], off:0, def:92, exp:95, prot:16, clu:88 },
      { name:"Mark Murphy", pos:["S"], off:0, def:80, exp:66, prot:28, clu:76 },
      { name:"Mark Moseley", pos:["K"], off:0, def:0, exp:10, prot:0, clu:84 },
    ]},
    "Dolphins":   { colors:["#008E97","#FC4C02"], players:[
      { name:"Dan Marino", pos:["QB"], off:95, def:0, exp:94, prot:30, clu:90 },
      { name:"Tony Nathan", pos:["RB"], off:76, def:0, exp:74, prot:52, clu:72 },
      { name:"Mark Clayton", pos:["WR"], off:85, def:0, exp:90, prot:10, clu:86 },
      { name:"Mark Duper", pos:["WR"], off:84, def:0, exp:92, prot:10, clu:82 },
      { name:"Bruce Hardy", pos:["TE"], off:66, def:0, exp:52, prot:64, clu:62 },
      { name:"Dwight Stephenson", pos:["OL"], off:62, def:0, exp:22, prot:97, clu:84 },
      { name:"Bob Baumhower", pos:["DL"], off:0, def:84, exp:68, prot:58, clu:80 },
      { name:"Doug Betters", pos:["EDGE"], off:0, def:82, exp:70, prot:44, clu:78 },
      { name:"A.J. Duhe", pos:["LB"], off:0, def:80, exp:64, prot:46, clu:80 },
      { name:"Don McNeal", pos:["CB"], off:0, def:80, exp:76, prot:18, clu:76 },
      { name:"Glenn Blackwood", pos:["S"], off:0, def:78, exp:66, prot:26, clu:74 },
      { name:"Uwe von Schamann", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
    "Raiders":    { colors:["#000000","#A5ACAF"], players:[
      { name:"Jim Plunkett", pos:["QB"], off:80, def:0, exp:72, prot:32, clu:86 },
      { name:"Marcus Allen", pos:["RB"], off:90, def:0, exp:88, prot:58, clu:92 },
      { name:"Cliff Branch", pos:["WR"], off:80, def:0, exp:88, prot:10, clu:82 },
      { name:"Malcolm Barnwell", pos:["WR"], off:70, def:0, exp:78, prot:10, clu:68 },
      { name:"Todd Christensen", pos:["TE"], off:82, def:0, exp:64, prot:66, clu:84 },
      { name:"Henry Lawrence", pos:["OL"], off:56, def:0, exp:18, prot:88, clu:78 },
      { name:"Howie Long", pos:["DL"], off:0, def:90, exp:82, prot:58, clu:88 },
      { name:"Lyle Alzado", pos:["EDGE"], off:0, def:84, exp:74, prot:48, clu:82 },
      { name:"Rod Martin", pos:["LB"], off:0, def:82, exp:70, prot:46, clu:82 },
      { name:"Mike Haynes", pos:["CB"], off:0, def:92, exp:86, prot:18, clu:88 },
      { name:"Vann McElroy", pos:["S"], off:0, def:80, exp:70, prot:28, clu:76 },
      { name:"Chris Bahr", pos:["K"], off:0, def:0, exp:10, prot:0, clu:78 },
    ]},
  },
  "1985-89": {
    "Bears":      { colors:["#0B162A","#C83803"], players:[
      { name:"Jim McMahon", pos:["QB"], off:78, def:0, exp:74, prot:30, clu:84 },
      { name:"Walter Payton", pos:["RB"], off:95, def:0, exp:90, prot:65, clu:96 },
      { name:"Willie Gault", pos:["WR"], off:76, def:0, exp:94, prot:10, clu:72 },
      { name:"Dennis McKinnon", pos:["WR"], off:70, def:0, exp:74, prot:10, clu:70 },
      { name:"Emery Moorehead", pos:["TE"], off:64, def:0, exp:48, prot:62, clu:60 },
      { name:"Jimbo Covert", pos:["OL"], off:60, def:0, exp:20, prot:93, clu:80 },
      { name:"Richard Dent", pos:["DL"], off:0, def:92, exp:85, prot:55, clu:90 },
      { name:"Dan Hampton", pos:["EDGE"], off:0, def:90, exp:78, prot:55, clu:88 },
      { name:"Mike Singletary", pos:["LB"], off:0, def:95, exp:74, prot:50, clu:92 },
      { name:"Mike Richardson", pos:["CB"], off:0, def:80, exp:78, prot:16, clu:76 },
      { name:"Gary Fencik", pos:["S"], off:0, def:82, exp:68, prot:30, clu:80 },
      { name:"Kevin Butler", pos:["K"], off:0, def:0, exp:12, prot:0, clu:78 },
    ]},
    "49ers":      { colors:["#AA0000","#B3995D"], players:[
      { name:"Joe Montana", pos:["QB"], off:94, def:0, exp:88, prot:35, clu:99 },
      { name:"Roger Craig", pos:["RB"], off:88, def:0, exp:84, prot:62, clu:86 },
      { name:"Jerry Rice", pos:["WR"], off:99, def:0, exp:96, prot:15, clu:98 },
      { name:"John Taylor", pos:["WR"], off:82, def:0, exp:86, prot:10, clu:84 },
      { name:"Brent Jones", pos:["TE"], off:76, def:0, exp:60, prot:68, clu:78 },
      { name:"Jesse Sapolu", pos:["OL"], off:58, def:0, exp:18, prot:90, clu:80 },
      { name:"Michael Carter", pos:["DL"], off:0, def:84, exp:64, prot:62, clu:80 },
      { name:"Charles Haley", pos:["EDGE"], off:0, def:92, exp:84, prot:48, clu:90 },
      { name:"Keena Turner", pos:["LB"], off:0, def:80, exp:64, prot:46, clu:80 },
      { name:"Ronnie Lott", pos:["S","CB"], off:0, def:97, exp:88, prot:32, clu:96 },
      { name:"Eric Wright", pos:["CB"], off:0, def:83, exp:80, prot:18, clu:80 },
      { name:"Mike Cofer", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
    "Giants":     { colors:["#0B2265","#A71930"], players:[
      { name:"Phil Simms", pos:["QB"], off:82, def:0, exp:76, prot:32, clu:88 },
      { name:"Joe Morris", pos:["RB"], off:80, def:0, exp:78, prot:50, clu:78 },
      { name:"Lionel Manuel", pos:["WR"], off:72, def:0, exp:74, prot:10, clu:70 },
      { name:"Stacy Robinson", pos:["WR"], off:68, def:0, exp:74, prot:10, clu:66 },
      { name:"Mark Bavaro", pos:["TE"], off:82, def:0, exp:64, prot:78, clu:86 },
      { name:"Brad Benson", pos:["OL"], off:56, def:0, exp:18, prot:88, clu:78 },
      { name:"Leonard Marshall", pos:["DL"], off:0, def:86, exp:76, prot:56, clu:84 },
      { name:"Lawrence Taylor", pos:["EDGE"], off:0, def:99, exp:95, prot:50, clu:97 },
      { name:"Harry Carson", pos:["LB"], off:0, def:88, exp:68, prot:52, clu:86 },
      { name:"Mark Collins", pos:["CB"], off:0, def:82, exp:78, prot:18, clu:78 },
      { name:"Terry Kinard", pos:["S"], off:0, def:80, exp:70, prot:28, clu:76 },
      { name:"Raul Allegre", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
    "Redskins":   { colors:["#5A1414","#FFB612"], players:[
      { name:"Doug Williams", pos:["QB"], off:80, def:0, exp:80, prot:32, clu:88 },
      { name:"George Rogers", pos:["RB"], off:80, def:0, exp:74, prot:52, clu:76 },
      { name:"Art Monk", pos:["WR"], off:86, def:0, exp:80, prot:12, clu:88 },
      { name:"Gary Clark", pos:["WR"], off:84, def:0, exp:86, prot:10, clu:84 },
      { name:"Don Warren", pos:["TE"], off:68, def:0, exp:50, prot:72, clu:66 },
      { name:"Joe Jacoby", pos:["OL"], off:60, def:0, exp:18, prot:93, clu:82 },
      { name:"Dave Butz", pos:["DL"], off:0, def:82, exp:58, prot:68, clu:80 },
      { name:"Dexter Manley", pos:["EDGE"], off:0, def:88, exp:82, prot:46, clu:84 },
      { name:"Wilber Marshall", pos:["LB"], off:0, def:88, exp:80, prot:50, clu:86 },
      { name:"Darrell Green", pos:["CB"], off:0, def:93, exp:96, prot:16, clu:90 },
      { name:"Todd Bowles", pos:["S"], off:0, def:78, exp:66, prot:28, clu:76 },
      { name:"Ali Haji-Sheikh", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
  },
  "1990-94": {
    "Cowboys":    { colors:["#003594","#869397"], players:[
      { name:"Troy Aikman", pos:["QB"], off:88, def:0, exp:80, prot:35, clu:92 },
      { name:"Emmitt Smith", pos:["RB"], off:94, def:0, exp:86, prot:60, clu:95 },
      { name:"Michael Irvin", pos:["WR"], off:90, def:0, exp:86, prot:14, clu:92 },
      { name:"Alvin Harper", pos:["WR"], off:78, def:0, exp:88, prot:10, clu:78 },
      { name:"Jay Novacek", pos:["TE"], off:80, def:0, exp:60, prot:66, clu:84 },
      { name:"Larry Allen", pos:["OL"], off:64, def:0, exp:24, prot:98, clu:86 },
      { name:"Tony Tolbert", pos:["DL"], off:0, def:84, exp:74, prot:54, clu:80 },
      { name:"Charles Haley", pos:["EDGE"], off:0, def:91, exp:82, prot:48, clu:90 },
      { name:"Ken Norton Jr.", pos:["LB"], off:0, def:84, exp:68, prot:48, clu:82 },
      { name:"Deion Sanders", pos:["CB"], off:0, def:98, exp:99, prot:14, clu:94 },
      { name:"Darren Woodson", pos:["S"], off:0, def:88, exp:78, prot:32, clu:86 },
      { name:"Chris Boniol", pos:["K"], off:0, def:0, exp:10, prot:0, clu:80 },
    ]},
    "Bills":      { colors:["#00338D","#C60C30"], players:[
      { name:"Jim Kelly", pos:["QB"], off:88, def:0, exp:84, prot:32, clu:88 },
      { name:"Thurman Thomas", pos:["RB"], off:90, def:0, exp:88, prot:62, clu:88 },
      { name:"Andre Reed", pos:["WR"], off:86, def:0, exp:84, prot:12, clu:88 },
      { name:"James Lofton", pos:["WR"], off:80, def:0, exp:86, prot:10, clu:80 },
      { name:"Pete Metzelaars", pos:["TE"], off:68, def:0, exp:48, prot:66, clu:66 },
      { name:"Kent Hull", pos:["OL"], off:58, def:0, exp:18, prot:90, clu:80 },
      { name:"Bruce Smith", pos:["DL"], off:0, def:97, exp:88, prot:60, clu:94 },
      { name:"Cornelius Bennett", pos:["EDGE"], off:0, def:88, exp:80, prot:46, clu:86 },
      { name:"Shane Conlan", pos:["LB"], off:0, def:84, exp:66, prot:48, clu:82 },
      { name:"Nate Odomes", pos:["CB"], off:0, def:82, exp:80, prot:16, clu:78 },
      { name:"Mark Kelso", pos:["S"], off:0, def:78, exp:64, prot:26, clu:74 },
      { name:"Steve Christie", pos:["K"], off:0, def:0, exp:10, prot:0, clu:80 },
    ]},
    "49ers":      { colors:["#AA0000","#B3995D"], players:[
      { name:"Steve Young", pos:["QB"], off:93, def:0, exp:92, prot:40, clu:90 },
      { name:"Ricky Watters", pos:["RB"], off:85, def:0, exp:84, prot:54, clu:82 },
      { name:"Jerry Rice", pos:["WR"], off:99, def:0, exp:95, prot:15, clu:99 },
      { name:"John Taylor", pos:["WR"], off:80, def:0, exp:82, prot:10, clu:82 },
      { name:"Brent Jones", pos:["TE"], off:78, def:0, exp:60, prot:68, clu:80 },
      { name:"Jesse Sapolu", pos:["OL"], off:58, def:0, exp:18, prot:90, clu:80 },
      { name:"Dana Stubblefield", pos:["DL"], off:0, def:86, exp:76, prot:58, clu:82 },
      { name:"Charles Haley", pos:["EDGE"], off:0, def:90, exp:82, prot:48, clu:88 },
      { name:"Bill Romanowski", pos:["LB"], off:0, def:82, exp:66, prot:48, clu:80 },
      { name:"Deion Sanders", pos:["CB"], off:0, def:97, exp:99, prot:14, clu:92 },
      { name:"Merton Hanks", pos:["S"], off:0, def:84, exp:76, prot:28, clu:80 },
      { name:"Mike Cofer", pos:["K"], off:0, def:0, exp:10, prot:0, clu:76 },
    ]},
    "Eagles":     { colors:["#004C54","#A5ACAF"], players:[
      { name:"Randall Cunningham", pos:["QB"], off:86, def:0, exp:94, prot:36, clu:84 },
      { name:"Herschel Walker", pos:["RB"], off:82, def:0, exp:84, prot:54, clu:80 },
      { name:"Fred Barnett", pos:["WR"], off:80, def:0, exp:86, prot:10, clu:80 },
      { name:"Calvin Williams", pos:["WR"], off:74, def:0, exp:76, prot:10, clu:74 },
      { name:"Keith Jackson", pos:["TE"], off:82, def:0, exp:68, prot:64, clu:82 },
      { name:"Antone Davis", pos:["OL"], off:54, def:0, exp:16, prot:84, clu:74 },
      { name:"Reggie White", pos:["DL"], off:0, def:99, exp:90, prot:64, clu:96 },
      { name:"Clyde Simmons", pos:["EDGE"], off:0, def:88, exp:80, prot:48, clu:84 },
      { name:"Seth Joyner", pos:["LB"], off:0, def:88, exp:78, prot:48, clu:86 },
      { name:"Eric Allen", pos:["CB"], off:0, def:88, exp:86, prot:16, clu:84 },
      { name:"Wes Hopkins", pos:["S"], off:0, def:82, exp:72, prot:30, clu:80 },
      { name:"Roger Ruzek", pos:["K"], off:0, def:0, exp:10, prot:0, clu:74 },
    ]},
  },
  "1995-99": {
    "Broncos":    { colors:["#FB4F14","#002244"], players:[
      { name:"John Elway", pos:["QB"], off:90, def:0, exp:90, prot:35, clu:97 },
      { name:"Terrell Davis", pos:["RB"], off:94, def:0, exp:88, prot:60, clu:94 },
      { name:"Rod Smith", pos:["WR"], off:84, def:0, exp:82, prot:12, clu:86 },
      { name:"Ed McCaffrey", pos:["WR"], off:80, def:0, exp:74, prot:12, clu:82 },
      { name:"Shannon Sharpe", pos:["TE"], off:88, def:0, exp:74, prot:64, clu:90 },
      { name:"Gary Zimmerman", pos:["OL"], off:60, def:0, exp:20, prot:94, clu:82 },
      { name:"Trevor Pryce", pos:["DL"], off:0, def:84, exp:76, prot:56, clu:80 },
      { name:"Neil Smith", pos:["EDGE"], off:0, def:86, exp:78, prot:46, clu:84 },
      { name:"Bill Romanowski", pos:["LB"], off:0, def:82, exp:66, prot:48, clu:82 },
      { name:"Ray Crockett", pos:["CB"], off:0, def:80, exp:78, prot:16, clu:78 },
      { name:"Steve Atwater", pos:["S"], off:0, def:90, exp:80, prot:36, clu:88 },
      { name:"Jason Elam", pos:["K"], off:0, def:0, exp:14, prot:0, clu:86 },
    ]},
    "Packers":    { colors:["#203731","#FFB612"], players:[
      { name:"Brett Favre", pos:["QB"], off:92, def:0, exp:92, prot:32, clu:90 },
      { name:"Dorsey Levens", pos:["RB"], off:82, def:0, exp:76, prot:56, clu:80 },
      { name:"Antonio Freeman", pos:["WR"], off:84, def:0, exp:84, prot:12, clu:86 },
      { name:"Robert Brooks", pos:["WR"], off:78, def:0, exp:82, prot:10, clu:76 },
      { name:"Mark Chmura", pos:["TE"], off:74, def:0, exp:56, prot:66, clu:74 },
      { name:"Frank Winters", pos:["OL"], off:56, def:0, exp:16, prot:88, clu:78 },
      { name:"Reggie White", pos:["DL"], off:0, def:98, exp:88, prot:62, clu:96 },
      { name:"Sean Jones", pos:["EDGE"], off:0, def:84, exp:76, prot:46, clu:80 },
      { name:"Wayne Simmons", pos:["LB"], off:0, def:80, exp:66, prot:46, clu:78 },
      { name:"Craig Newsome", pos:["CB"], off:0, def:80, exp:78, prot:16, clu:76 },
      { name:"LeRoy Butler", pos:["S"], off:0, def:90, exp:82, prot:34, clu:88 },
      { name:"Ryan Longwell", pos:["K"], off:0, def:0, exp:12, prot:0, clu:82 },
    ]},
    "Cowboys":    { colors:["#003594","#869397"], players:[
      { name:"Troy Aikman", pos:["QB"], off:86, def:0, exp:78, prot:35, clu:90 },
      { name:"Emmitt Smith", pos:["RB"], off:92, def:0, exp:82, prot:60, clu:94 },
      { name:"Michael Irvin", pos:["WR"], off:88, def:0, exp:84, prot:14, clu:90 },
      { name:"Deion Sanders", pos:["WR","CB"], off:70, def:96, exp:99, prot:14, clu:92 },
      { name:"Jay Novacek", pos:["TE"], off:78, def:0, exp:58, prot:66, clu:82 },
      { name:"Larry Allen", pos:["OL"], off:66, def:0, exp:26, prot:99, clu:88 },
      { name:"Leon Lett", pos:["DL"], off:0, def:84, exp:72, prot:60, clu:78 },
      { name:"Charles Haley", pos:["EDGE"], off:0, def:88, exp:78, prot:48, clu:88 },
      { name:"Ken Norton Jr.", pos:["LB"], off:0, def:82, exp:66, prot:48, clu:80 },
      { name:"Kevin Smith", pos:["CB"], off:0, def:82, exp:80, prot:16, clu:78 },
      { name:"Darren Woodson", pos:["S"], off:0, def:88, exp:78, prot:32, clu:86 },
      { name:"Chris Boniol", pos:["K"], off:0, def:0, exp:10, prot:0, clu:80 },
    ]},
    "Steelers":   { colors:["#FFB612","#101820"], players:[
      { name:"Kordell Stewart", pos:["QB"], off:78, def:0, exp:86, prot:34, clu:78 },
      { name:"Jerome Bettis", pos:["RB"], off:88, def:0, exp:72, prot:62, clu:88 },
      { name:"Yancey Thigpen", pos:["WR"], off:80, def:0, exp:82, prot:10, clu:80 },
      { name:"Charles Johnson", pos:["WR"], off:72, def:0, exp:76, prot:10, clu:72 },
      { name:"Mark Bruener", pos:["TE"], off:66, def:0, exp:46, prot:70, clu:64 },
      { name:"Dermontti Dawson", pos:["OL"], off:62, def:0, exp:22, prot:96, clu:84 },
      { name:"Joel Steed", pos:["DL"], off:0, def:80, exp:56, prot:66, clu:78 },
      { name:"Greg Lloyd", pos:["EDGE"], off:0, def:88, exp:80, prot:48, clu:86 },
      { name:"Levon Kirkland", pos:["LB"], off:0, def:86, exp:70, prot:52, clu:84 },
      { name:"Rod Woodson", pos:["CB"], off:0, def:94, exp:90, prot:18, clu:90 },
      { name:"Carnell Lake", pos:["S"], off:0, def:86, exp:78, prot:32, clu:84 },
      { name:"Norm Johnson", pos:["K"], off:0, def:0, exp:10, prot:0, clu:80 },
    ]},
  },
  "2000-04": {
    "Patriots":   { colors:["#002244","#C60C30"], players:[
      { name:"Tom Brady", pos:["QB"], off:90, def:0, exp:80, prot:35, clu:99 },
      { name:"Corey Dillon", pos:["RB"], off:85, def:0, exp:80, prot:58, clu:82 },
      { name:"Deion Branch", pos:["WR"], off:80, def:0, exp:80, prot:12, clu:88 },
      { name:"David Givens", pos:["WR"], off:74, def:0, exp:72, prot:12, clu:78 },
      { name:"Daniel Graham", pos:["TE"], off:70, def:0, exp:54, prot:70, clu:70 },
      { name:"Matt Light", pos:["OL"], off:58, def:0, exp:18, prot:90, clu:82 },
      { name:"Richard Seymour", pos:["DL"], off:0, def:92, exp:80, prot:64, clu:90 },
      { name:"Willie McGinest", pos:["EDGE"], off:0, def:86, exp:78, prot:48, clu:88 },
      { name:"Tedy Bruschi", pos:["LB"], off:0, def:86, exp:72, prot:50, clu:90 },
      { name:"Ty Law", pos:["CB"], off:0, def:90, exp:84, prot:18, clu:90 },
      { name:"Rodney Harrison", pos:["S"], off:0, def:88, exp:76, prot:36, clu:90 },
      { name:"Adam Vinatieri", pos:["K"], off:0, def:0, exp:16, prot:0, clu:99 },
    ]},
    "Rams":       { colors:["#003594","#FFA300"], players:[
      { name:"Kurt Warner", pos:["QB"], off:94, def:0, exp:92, prot:30, clu:92 },
      { name:"Marshall Faulk", pos:["RB"], off:97, def:0, exp:94, prot:64, clu:94 },
      { name:"Isaac Bruce", pos:["WR"], off:88, def:0, exp:88, prot:12, clu:90 },
      { name:"Torry Holt", pos:["WR"], off:87, def:0, exp:88, prot:12, clu:86 },
      { name:"Ernie Conwell", pos:["TE"], off:66, def:0, exp:48, prot:64, clu:62 },
      { name:"Orlando Pace", pos:["OL"], off:64, def:0, exp:22, prot:97, clu:86 },
      { name:"Kevin Carter", pos:["DL"], off:0, def:84, exp:76, prot:56, clu:80 },
      { name:"Leonard Little", pos:["EDGE"], off:0, def:82, exp:78, prot:44, clu:78 },
      { name:"London Fletcher", pos:["LB"], off:0, def:84, exp:68, prot:48, clu:84 },
      { name:"Aeneas Williams", pos:["CB"], off:0, def:88, exp:84, prot:18, clu:86 },
      { name:"Adam Archuleta", pos:["S"], off:0, def:80, exp:70, prot:30, clu:76 },
      { name:"Jeff Wilkins", pos:["K"], off:0, def:0, exp:12, prot:0, clu:82 },
    ]},
    "Ravens":     { colors:["#241773","#000000"], players:[
      { name:"Trent Dilfer", pos:["QB"], off:72, def:0, exp:66, prot:32, clu:80 },
      { name:"Jamal Lewis", pos:["RB"], off:88, def:0, exp:80, prot:60, clu:86 },
      { name:"Travis Taylor", pos:["WR"], off:72, def:0, exp:74, prot:10, clu:70 },
      { name:"Qadry Ismail", pos:["WR"], off:74, def:0, exp:80, prot:10, clu:74 },
      { name:"Shannon Sharpe", pos:["TE"], off:84, def:0, exp:70, prot:62, clu:86 },
      { name:"Jonathan Ogden", pos:["OL"], off:64, def:0, exp:22, prot:98, clu:86 },
      { name:"Sam Adams", pos:["DL"], off:0, def:86, exp:62, prot:70, clu:82 },
      { name:"Michael McCrary", pos:["EDGE"], off:0, def:84, exp:78, prot:46, clu:80 },
      { name:"Ray Lewis", pos:["LB"], off:0, def:99, exp:88, prot:54, clu:97 },
      { name:"Chris McAlister", pos:["CB"], off:0, def:86, exp:84, prot:18, clu:82 },
      { name:"Rod Woodson", pos:["S"], off:0, def:90, exp:82, prot:34, clu:90 },
      { name:"Matt Stover", pos:["K"], off:0, def:0, exp:12, prot:0, clu:88 },
    ]},
    "Eagles":     { colors:["#004C54","#A5ACAF"], players:[
      { name:"Donovan McNabb", pos:["QB"], off:86, def:0, exp:88, prot:38, clu:86 },
      { name:"Brian Westbrook", pos:["RB"], off:88, def:0, exp:90, prot:56, clu:88 },
      { name:"Terrell Owens", pos:["WR"], off:92, def:0, exp:90, prot:16, clu:90 },
      { name:"Todd Pinkston", pos:["WR"], off:68, def:0, exp:78, prot:10, clu:66 },
      { name:"Chad Lewis", pos:["TE"], off:72, def:0, exp:52, prot:64, clu:74 },
      { name:"Tra Thomas", pos:["OL"], off:58, def:0, exp:18, prot:90, clu:80 },
      { name:"Corey Simon", pos:["DL"], off:0, def:84, exp:72, prot:60, clu:80 },
      { name:"Hugh Douglas", pos:["EDGE"], off:0, def:86, exp:82, prot:46, clu:82 },
      { name:"Jeremiah Trotter", pos:["LB"], off:0, def:86, exp:72, prot:52, clu:84 },
      { name:"Troy Vincent", pos:["CB"], off:0, def:86, exp:82, prot:18, clu:84 },
      { name:"Brian Dawkins", pos:["S"], off:0, def:94, exp:88, prot:38, clu:94 },
      { name:"David Akers", pos:["K"], off:0, def:0, exp:14, prot:0, clu:88 },
    ]},
  },
  "2005-09": {
    "Colts":      { colors:["#002C5F","#A2AAAD"], players:[
      { name:"Peyton Manning", pos:["QB"], off:96, def:0, exp:88, prot:38, clu:94 },
      { name:"Joseph Addai", pos:["RB"], off:82, def:0, exp:80, prot:56, clu:82 },
      { name:"Reggie Wayne", pos:["WR"], off:88, def:0, exp:86, prot:12, clu:90 },
      { name:"Marvin Harrison", pos:["WR"], off:92, def:0, exp:90, prot:12, clu:92 },
      { name:"Dallas Clark", pos:["TE"], off:82, def:0, exp:66, prot:64, clu:84 },
      { name:"Jeff Saturday", pos:["OL"], off:60, def:0, exp:18, prot:90, clu:84 },
      { name:"Dwight Freeney", pos:["DL"], off:0, def:90, exp:88, prot:54, clu:88 },
      { name:"Robert Mathis", pos:["EDGE"], off:0, def:88, exp:84, prot:46, clu:86 },
      { name:"Gary Brackett", pos:["LB"], off:0, def:80, exp:66, prot:46, clu:80 },
      { name:"Marlin Jackson", pos:["CB"], off:0, def:80, exp:78, prot:16, clu:80 },
      { name:"Bob Sanders", pos:["S"], off:0, def:90, exp:84, prot:34, clu:88 },
      { name:"Adam Vinatieri", pos:["K"], off:0, def:0, exp:16, prot:0, clu:97 },
    ]},
    "Steelers":   { colors:["#FFB612","#101820"], players:[
      { name:"Ben Roethlisberger", pos:["QB"], off:87, def:0, exp:84, prot:45, clu:90 },
      { name:"Willie Parker", pos:["RB"], off:80, def:0, exp:84, prot:50, clu:78 },
      { name:"Hines Ward", pos:["WR"], off:84, def:0, exp:78, prot:30, clu:90 },
      { name:"Santonio Holmes", pos:["WR"], off:80, def:0, exp:84, prot:12, clu:88 },
      { name:"Heath Miller", pos:["TE"], off:78, def:0, exp:58, prot:72, clu:80 },
      { name:"Alan Faneca", pos:["OL"], off:62, def:0, exp:20, prot:95, clu:84 },
      { name:"Casey Hampton", pos:["DL"], off:0, def:84, exp:60, prot:70, clu:82 },
      { name:"James Harrison", pos:["EDGE"], off:0, def:92, exp:86, prot:50, clu:90 },
      { name:"James Farrior", pos:["LB"], off:0, def:84, exp:68, prot:50, clu:84 },
      { name:"Ike Taylor", pos:["CB"], off:0, def:82, exp:80, prot:16, clu:80 },
      { name:"Troy Polamalu", pos:["S"], off:0, def:95, exp:92, prot:36, clu:94 },
      { name:"Jeff Reed", pos:["K"], off:0, def:0, exp:12, prot:0, clu:80 },
    ]},
    "Patriots":   { colors:["#002244","#C60C30"], players:[
      { name:"Tom Brady", pos:["QB"], off:96, def:0, exp:84, prot:35, clu:97 },
      { name:"Laurence Maroney", pos:["RB"], off:76, def:0, exp:74, prot:50, clu:72 },
      { name:"Randy Moss", pos:["WR"], off:95, def:0, exp:98, prot:12, clu:90 },
      { name:"Wes Welker", pos:["WR"], off:86, def:0, exp:80, prot:12, clu:88 },
      { name:"Benjamin Watson", pos:["TE"], off:72, def:0, exp:60, prot:66, clu:72 },
      { name:"Matt Light", pos:["OL"], off:58, def:0, exp:18, prot:90, clu:82 },
      { name:"Vince Wilfork", pos:["DL"], off:0, def:88, exp:62, prot:72, clu:86 },
      { name:"Mike Vrabel", pos:["EDGE"], off:0, def:84, exp:74, prot:48, clu:86 },
      { name:"Tedy Bruschi", pos:["LB"], off:0, def:82, exp:68, prot:50, clu:86 },
      { name:"Asante Samuel", pos:["CB"], off:0, def:86, exp:86, prot:16, clu:84 },
      { name:"Rodney Harrison", pos:["S"], off:0, def:86, exp:74, prot:36, clu:88 },
      { name:"Stephen Gostkowski", pos:["K"], off:0, def:0, exp:14, prot:0, clu:86 },
    ]},
    "Saints":     { colors:["#D3BC8D","#101820"], players:[
      { name:"Drew Brees", pos:["QB"], off:94, def:0, exp:86, prot:34, clu:92 },
      { name:"Pierre Thomas", pos:["RB"], off:80, def:0, exp:78, prot:54, clu:80 },
      { name:"Marques Colston", pos:["WR"], off:84, def:0, exp:80, prot:14, clu:84 },
      { name:"Devery Henderson", pos:["WR"], off:72, def:0, exp:86, prot:10, clu:72 },
      { name:"Jeremy Shockey", pos:["TE"], off:78, def:0, exp:62, prot:64, clu:78 },
      { name:"Jahri Evans", pos:["OL"], off:62, def:0, exp:20, prot:94, clu:84 },
      { name:"Sedrick Ellis", pos:["DL"], off:0, def:80, exp:68, prot:58, clu:76 },
      { name:"Will Smith", pos:["EDGE"], off:0, def:84, exp:78, prot:46, clu:80 },
      { name:"Jonathan Vilma", pos:["LB"], off:0, def:84, exp:70, prot:48, clu:84 },
      { name:"Tracy Porter", pos:["CB"], off:0, def:80, exp:82, prot:16, clu:84 },
      { name:"Darren Sharper", pos:["S"], off:0, def:88, exp:86, prot:34, clu:88 },
      { name:"Garrett Hartley", pos:["K"], off:0, def:0, exp:12, prot:0, clu:82 },
    ]},
  },
  "2010-14": {
    "Seahawks":   { colors:["#002244","#69BE28"], players:[
      { name:"Russell Wilson", pos:["QB"], off:86, def:0, exp:88, prot:42, clu:90 },
      { name:"Marshawn Lynch", pos:["RB"], off:90, def:0, exp:86, prot:64, clu:92 },
      { name:"Doug Baldwin", pos:["WR"], off:80, def:0, exp:80, prot:12, clu:84 },
      { name:"Golden Tate", pos:["WR"], off:78, def:0, exp:82, prot:12, clu:78 },
      { name:"Zach Miller", pos:["TE"], off:70, def:0, exp:52, prot:70, clu:70 },
      { name:"Russell Okung", pos:["OL"], off:60, def:0, exp:20, prot:90, clu:80 },
      { name:"Michael Bennett", pos:["DL"], off:0, def:88, exp:82, prot:58, clu:86 },
      { name:"Cliff Avril", pos:["EDGE"], off:0, def:85, exp:80, prot:44, clu:82 },
      { name:"Bobby Wagner", pos:["LB"], off:0, def:92, exp:80, prot:50, clu:90 },
      { name:"Richard Sherman", pos:["CB"], off:0, def:95, exp:86, prot:18, clu:92 },
      { name:"Earl Thomas", pos:["S"], off:0, def:94, exp:88, prot:34, clu:90 },
      { name:"Steven Hauschka", pos:["K"], off:0, def:0, exp:12, prot:0, clu:82 },
    ]},
    "Patriots":   { colors:["#002244","#C60C30"], players:[
      { name:"Tom Brady", pos:["QB"], off:94, def:0, exp:82, prot:35, clu:99 },
      { name:"LeGarrette Blount", pos:["RB"], off:80, def:0, exp:72, prot:54, clu:80 },
      { name:"Julian Edelman", pos:["WR"], off:82, def:0, exp:80, prot:14, clu:92 },
      { name:"Brandon LaFell", pos:["WR"], off:74, def:0, exp:74, prot:12, clu:74 },
      { name:"Rob Gronkowski", pos:["TE"], off:96, def:0, exp:84, prot:78, clu:94 },
      { name:"Nate Solder", pos:["OL"], off:58, def:0, exp:18, prot:88, clu:80 },
      { name:"Vince Wilfork", pos:["DL"], off:0, def:88, exp:62, prot:72, clu:86 },
      { name:"Chandler Jones", pos:["EDGE"], off:0, def:86, exp:82, prot:46, clu:82 },
      { name:"Dont'a Hightower", pos:["LB"], off:0, def:86, exp:74, prot:50, clu:88 },
      { name:"Darrelle Revis", pos:["CB"], off:0, def:96, exp:86, prot:18, clu:90 },
      { name:"Devin McCourty", pos:["S"], off:0, def:86, exp:78, prot:32, clu:84 },
      { name:"Stephen Gostkowski", pos:["K"], off:0, def:0, exp:14, prot:0, clu:88 },
    ]},
    "Packers":    { colors:["#203731","#FFB612"], players:[
      { name:"Aaron Rodgers", pos:["QB"], off:96, def:0, exp:92, prot:40, clu:92 },
      { name:"Eddie Lacy", pos:["RB"], off:82, def:0, exp:74, prot:56, clu:78 },
      { name:"Jordy Nelson", pos:["WR"], off:88, def:0, exp:88, prot:12, clu:88 },
      { name:"Randall Cobb", pos:["WR"], off:82, def:0, exp:84, prot:12, clu:82 },
      { name:"Jermichael Finley", pos:["TE"], off:76, def:0, exp:64, prot:62, clu:74 },
      { name:"Josh Sitton", pos:["OL"], off:62, def:0, exp:20, prot:93, clu:82 },
      { name:"B.J. Raji", pos:["DL"], off:0, def:82, exp:62, prot:66, clu:80 },
      { name:"Clay Matthews", pos:["EDGE"], off:0, def:90, exp:86, prot:48, clu:88 },
      { name:"A.J. Hawk", pos:["LB"], off:0, def:78, exp:62, prot:46, clu:76 },
      { name:"Charles Woodson", pos:["CB","S"], off:0, def:92, exp:88, prot:24, clu:90 },
      { name:"Morgan Burnett", pos:["S"], off:0, def:80, exp:72, prot:30, clu:78 },
      { name:"Mason Crosby", pos:["K"], off:0, def:0, exp:12, prot:0, clu:84 },
    ]},
  },
  "2015-19": {
    "Chiefs":     { colors:["#E31837","#FFB81C"], players:[
      { name:"Patrick Mahomes", pos:["QB"], off:97, def:0, exp:97, prot:42, clu:95 },
      { name:"Kareem Hunt", pos:["RB"], off:84, def:0, exp:84, prot:54, clu:80 },
      { name:"Tyreek Hill", pos:["WR"], off:90, def:0, exp:99, prot:12, clu:90 },
      { name:"Sammy Watkins", pos:["WR"], off:78, def:0, exp:84, prot:12, clu:80 },
      { name:"Travis Kelce", pos:["TE"], off:94, def:0, exp:84, prot:66, clu:94 },
      { name:"Mitchell Schwartz", pos:["OL"], off:62, def:0, exp:20, prot:94, clu:84 },
      { name:"Chris Jones", pos:["DL"], off:0, def:90, exp:84, prot:60, clu:88 },
      { name:"Justin Houston", pos:["EDGE"], off:0, def:86, exp:82, prot:46, clu:84 },
      { name:"Anthony Hitchens", pos:["LB"], off:0, def:78, exp:64, prot:46, clu:76 },
      { name:"Marcus Peters", pos:["CB"], off:0, def:88, exp:88, prot:16, clu:84 },
      { name:"Tyrann Mathieu", pos:["S"], off:0, def:90, exp:86, prot:32, clu:90 },
      { name:"Harrison Butker", pos:["K"], off:0, def:0, exp:14, prot:0, clu:88 },
    ]},
    "Patriots":   { colors:["#002244","#C60C30"], players:[
      { name:"Tom Brady", pos:["QB"], off:95, def:0, exp:82, prot:35, clu:99 },
      { name:"Sony Michel", pos:["RB"], off:78, def:0, exp:74, prot:52, clu:78 },
      { name:"Julian Edelman", pos:["WR"], off:84, def:0, exp:80, prot:14, clu:94 },
      { name:"Chris Hogan", pos:["WR"], off:74, def:0, exp:76, prot:12, clu:78 },
      { name:"Rob Gronkowski", pos:["TE"], off:95, def:0, exp:82, prot:78, clu:94 },
      { name:"David Andrews", pos:["OL"], off:58, def:0, exp:16, prot:88, clu:82 },
      { name:"Lawrence Guy", pos:["DL"], off:0, def:80, exp:62, prot:66, clu:78 },
      { name:"Kyle Van Noy", pos:["EDGE"], off:0, def:82, exp:76, prot:46, clu:82 },
      { name:"Dont'a Hightower", pos:["LB"], off:0, def:86, exp:74, prot:50, clu:88 },
      { name:"Stephon Gilmore", pos:["CB"], off:0, def:94, exp:84, prot:18, clu:90 },
      { name:"Devin McCourty", pos:["S"], off:0, def:86, exp:78, prot:32, clu:84 },
      { name:"Stephen Gostkowski", pos:["K"], off:0, def:0, exp:14, prot:0, clu:88 },
    ]},
    "Rams":       { colors:["#003594","#FFA300"], players:[
      { name:"Jared Goff", pos:["QB"], off:84, def:0, exp:78, prot:36, clu:80 },
      { name:"Todd Gurley", pos:["RB"], off:90, def:0, exp:86, prot:56, clu:86 },
      { name:"Robert Woods", pos:["WR"], off:82, def:0, exp:82, prot:14, clu:82 },
      { name:"Brandin Cooks", pos:["WR"], off:84, def:0, exp:90, prot:12, clu:82 },
      { name:"Tyler Higbee", pos:["TE"], off:72, def:0, exp:56, prot:64, clu:72 },
      { name:"Andrew Whitworth", pos:["OL"], off:62, def:0, exp:18, prot:94, clu:86 },
      { name:"Aaron Donald", pos:["DL"], off:0, def:99, exp:92, prot:66, clu:96 },
      { name:"Dante Fowler", pos:["EDGE"], off:0, def:82, exp:78, prot:44, clu:78 },
      { name:"Cory Littleton", pos:["LB"], off:0, def:82, exp:72, prot:46, clu:80 },
      { name:"Aqib Talib", pos:["CB"], off:0, def:86, exp:84, prot:18, clu:84 },
      { name:"Lamarcus Joyner", pos:["S"], off:0, def:80, exp:74, prot:30, clu:78 },
      { name:"Greg Zuerlein", pos:["K"], off:0, def:0, exp:14, prot:0, clu:84 },
    ]},
  },
  "2020-24": {
    "Chiefs":     { colors:["#E31837","#FFB81C"], players:[
      { name:"Patrick Mahomes", pos:["QB"], off:97, def:0, exp:95, prot:44, clu:98 },
      { name:"Isiah Pacheco", pos:["RB"], off:80, def:0, exp:80, prot:52, clu:80 },
      { name:"Travis Kelce", pos:["TE"], off:93, def:0, exp:80, prot:66, clu:95 },
      { name:"Rashee Rice", pos:["WR"], off:80, def:0, exp:82, prot:12, clu:80 },
      { name:"JuJu Smith-Schuster", pos:["WR"], off:76, def:0, exp:74, prot:14, clu:78 },
      { name:"Creed Humphrey", pos:["OL"], off:64, def:0, exp:20, prot:95, clu:84 },
      { name:"Chris Jones", pos:["DL"], off:0, def:94, exp:86, prot:64, clu:92 },
      { name:"George Karlaftis", pos:["EDGE"], off:0, def:82, exp:78, prot:46, clu:80 },
      { name:"Nick Bolton", pos:["LB"], off:0, def:84, exp:72, prot:48, clu:84 },
      { name:"Trent McDuffie", pos:["CB"], off:0, def:86, exp:84, prot:18, clu:84 },
      { name:"Justin Reid", pos:["S"], off:0, def:82, exp:74, prot:32, clu:80 },
      { name:"Harrison Butker", pos:["K"], off:0, def:0, exp:14, prot:0, clu:90 },
    ]},
    "Eagles":     { colors:["#004C54","#A5ACAF"], players:[
      { name:"Jalen Hurts", pos:["QB"], off:88, def:0, exp:88, prot:48, clu:88 },
      { name:"Saquon Barkley", pos:["RB"], off:94, def:0, exp:94, prot:58, clu:90 },
      { name:"A.J. Brown", pos:["WR"], off:92, def:0, exp:88, prot:16, clu:90 },
      { name:"DeVonta Smith", pos:["WR"], off:84, def:0, exp:84, prot:12, clu:84 },
      { name:"Dallas Goedert", pos:["TE"], off:80, def:0, exp:64, prot:70, clu:80 },
      { name:"Lane Johnson", pos:["OL"], off:66, def:0, exp:22, prot:98, clu:88 },
      { name:"Jalen Carter", pos:["DL"], off:0, def:90, exp:84, prot:62, clu:86 },
      { name:"Josh Sweat", pos:["EDGE"], off:0, def:84, exp:80, prot:44, clu:82 },
      { name:"Zack Baun", pos:["LB"], off:0, def:86, exp:74, prot:48, clu:84 },
      { name:"Darius Slay", pos:["CB"], off:0, def:86, exp:84, prot:16, clu:84 },
      { name:"Reed Blankenship", pos:["S"], off:0, def:80, exp:72, prot:30, clu:78 },
      { name:"Jake Elliott", pos:["K"], off:0, def:0, exp:14, prot:0, clu:86 },
    ]},
    "Ravens":     { colors:["#241773","#000000"], players:[
      { name:"Lamar Jackson", pos:["QB"], off:92, def:0, exp:96, prot:46, clu:88 },
      { name:"Derrick Henry", pos:["RB"], off:93, def:0, exp:88, prot:58, clu:90 },
      { name:"Zay Flowers", pos:["WR"], off:82, def:0, exp:86, prot:12, clu:82 },
      { name:"Rashod Bateman", pos:["WR"], off:74, def:0, exp:76, prot:12, clu:74 },
      { name:"Mark Andrews", pos:["TE"], off:86, def:0, exp:72, prot:64, clu:86 },
      { name:"Ronnie Stanley", pos:["OL"], off:62, def:0, exp:20, prot:92, clu:82 },
      { name:"Nnamdi Madubuike", pos:["DL"], off:0, def:86, exp:78, prot:60, clu:82 },
      { name:"Kyle Van Noy", pos:["EDGE"], off:0, def:82, exp:76, prot:46, clu:80 },
      { name:"Roquan Smith", pos:["LB"], off:0, def:92, exp:82, prot:50, clu:90 },
      { name:"Marlon Humphrey", pos:["CB"], off:0, def:88, exp:84, prot:18, clu:86 },
      { name:"Kyle Hamilton", pos:["S"], off:0, def:90, exp:84, prot:36, clu:86 },
      { name:"Justin Tucker", pos:["K"], off:0, def:0, exp:18, prot:0, clu:97 },
    ]},
    "49ers":      { colors:["#AA0000","#B3995D"], players:[
      { name:"Brock Purdy", pos:["QB"], off:86, def:0, exp:82, prot:40, clu:84 },
      { name:"Christian McCaffrey", pos:["RB"], off:96, def:0, exp:92, prot:62, clu:92 },
      { name:"Deebo Samuel", pos:["WR"], off:88, def:0, exp:90, prot:20, clu:86 },
      { name:"Brandon Aiyuk", pos:["WR"], off:86, def:0, exp:86, prot:12, clu:84 },
      { name:"George Kittle", pos:["TE"], off:90, def:0, exp:78, prot:74, clu:88 },
      { name:"Trent Williams", pos:["OL"], off:68, def:0, exp:26, prot:99, clu:90 },
      { name:"Arik Armstead", pos:["DL"], off:0, def:84, exp:72, prot:62, clu:82 },
      { name:"Nick Bosa", pos:["EDGE"], off:0, def:94, exp:88, prot:50, clu:90 },
      { name:"Fred Warner", pos:["LB"], off:0, def:94, exp:84, prot:52, clu:92 },
      { name:"Charvarius Ward", pos:["CB"], off:0, def:86, exp:84, prot:18, clu:84 },
      { name:"Talanoa Hufanga", pos:["S"], off:0, def:84, exp:80, prot:34, clu:82 },
      { name:"Jake Moody", pos:["K"], off:0, def:0, exp:12, prot:0, clu:78 },
    ]},
  },
};


// ─── NHL DATABASE ──────────────────────────────────────────────────────────────
// 9 slots: top line (C1 LW1 RW1) + checking line (C2 F2 F3) + 2 D (D1 D2) + G
// Categories (0-99): off (offense), def (defense), phys (physicality/grit),
// fo (faceoff/puck-battles), clu (clutch/playoff). Goalies use def+clu mainly.
const NHL_TEAMS = {
  "1960s": {
    "Maple Leafs": { colors:["#00205B","#FFFFFF"], players:[
      { name:"Dave Keon", pos:["C"], off:84, def:88, phys:55, fo:88, clu:90 },
      { name:"Frank Mahovlich", pos:["LW"], off:90, def:60, phys:72, fo:35, clu:86 },
      { name:"George Armstrong", pos:["RW"], off:76, def:78, phys:70, fo:40, clu:84 },
      { name:"Red Kelly", pos:["C","D"], off:80, def:86, phys:62, fo:80, clu:88 },
      { name:"Bob Pulford", pos:["C","LW"], off:74, def:80, phys:74, fo:78, clu:80 },
      { name:"Ron Ellis", pos:["RW"], off:74, def:76, phys:64, fo:35, clu:74 },
      { name:"Tim Horton", pos:["D"], off:72, def:90, phys:88, fo:0, clu:86 },
      { name:"Allan Stanley", pos:["D"], off:62, def:86, phys:80, fo:0, clu:80 },
      { name:"Carl Brewer", pos:["D"], off:66, def:84, phys:78, fo:0, clu:76 },
      { name:"Johnny Bower", pos:["G"], off:0, def:90, phys:0, fo:0, clu:92 },
    ]},
    "Canadiens": { colors:["#AF1E2D","#192168"], players:[
      { name:"Jean Beliveau", pos:["C"], off:92, def:78, phys:72, fo:86, clu:94 },
      { name:"Henri Richard", pos:["C"], off:82, def:80, phys:60, fo:84, clu:88 },
      { name:"Bernie Geoffrion", pos:["RW"], off:88, def:58, phys:64, fo:35, clu:84 },
      { name:"Dickie Moore", pos:["LW"], off:84, def:64, phys:68, fo:38, clu:82 },
      { name:"Yvan Cournoyer", pos:["RW"], off:86, def:62, phys:54, fo:32, clu:82 },
      { name:"Ralph Backstrom", pos:["C","LW"], off:76, def:72, phys:60, fo:80, clu:76 },
      { name:"Doug Harvey", pos:["D"], off:80, def:92, phys:78, fo:0, clu:90 },
      { name:"Jacques Laperriere", pos:["D"], off:64, def:88, phys:82, fo:0, clu:80 },
      { name:"Tom Johnson", pos:["D"], off:62, def:84, phys:76, fo:0, clu:78 },
      { name:"Jacques Plante", pos:["G"], off:0, def:93, phys:0, fo:0, clu:92 },
    ]},
    "Black Hawks": { colors:["#CF0A2C","#000000"], players:[
      { name:"Bobby Hull", pos:["LW"], off:95, def:58, phys:80, fo:40, clu:90 },
      { name:"Stan Mikita", pos:["C"], off:90, def:80, phys:62, fo:90, clu:90 },
      { name:"Kenny Wharram", pos:["RW"], off:78, def:66, phys:56, fo:35, clu:76 },
      { name:"Bill Hay", pos:["C"], off:74, def:70, phys:66, fo:78, clu:74 },
      { name:"Doug Mohns", pos:["LW","D"], off:72, def:78, phys:74, fo:40, clu:74 },
      { name:"Chico Maki", pos:["RW","C"], off:70, def:72, phys:60, fo:70, clu:72 },
      { name:"Pierre Pilote", pos:["D"], off:78, def:90, phys:80, fo:0, clu:86 },
      { name:"Elmer Vasko", pos:["D"], off:58, def:84, phys:86, fo:0, clu:76 },
      { name:"Matt Ravlich", pos:["D"], off:60, def:80, phys:76, fo:0, clu:72 },
      { name:"Glenn Hall", pos:["G"], off:0, def:92, phys:0, fo:0, clu:90 },
    ]},
    "Red Wings": { colors:["#CE1126","#FFFFFF"], players:[
      { name:"Gordie Howe", pos:["RW"], off:96, def:80, phys:92, fo:60, clu:96 },
      { name:"Alex Delvecchio", pos:["C"], off:84, def:78, phys:64, fo:86, clu:86 },
      { name:"Norm Ullman", pos:["C"], off:82, def:76, phys:62, fo:84, clu:82 },
      { name:"Parker MacDonald", pos:["LW"], off:72, def:66, phys:64, fo:38, clu:72 },
      { name:"Floyd Smith", pos:["RW","C"], off:70, def:64, phys:60, fo:72, clu:70 },
      { name:"Bruce MacGregor", pos:["RW"], off:72, def:68, phys:58, fo:36, clu:72 },
      { name:"Bill Gadsby", pos:["D"], off:70, def:88, phys:82, fo:0, clu:82 },
      { name:"Marcel Pronovost", pos:["D"], off:68, def:86, phys:80, fo:0, clu:82 },
      { name:"Doug Barkley", pos:["D"], off:64, def:80, phys:78, fo:0, clu:74 },
      { name:"Roger Crozier", pos:["G"], off:0, def:86, phys:0, fo:0, clu:84 },
    ]},
  },
  "1970s": {
    "Canadiens": { colors:["#AF1E2D","#192168"], players:[
      { name:"Guy Lafleur", pos:["RW"], off:97, def:60, phys:55, fo:30, clu:94 },
      { name:"Steve Shutt", pos:["LW"], off:88, def:58, phys:60, fo:25, clu:84 },
      { name:"Jacques Lemaire", pos:["C"], off:85, def:82, phys:62, fo:80, clu:88 },
      { name:"Bob Gainey", pos:["LW","C"], off:64, def:95, phys:80, fo:70, clu:86 },
      { name:"Doug Jarvis", pos:["C"], off:58, def:90, phys:65, fo:88, clu:82 },
      { name:"Yvon Lambert", pos:["LW","RW"], off:70, def:72, phys:78, fo:40, clu:74 },
      { name:"Larry Robinson", pos:["D"], off:84, def:94, phys:85, fo:0, clu:90 },
      { name:"Serge Savard", pos:["D"], off:72, def:92, phys:78, fo:0, clu:86 },
      { name:"Ken Dryden", pos:["G"], off:0, def:96, phys:0, fo:0, clu:94 },
    ]},
    "Flyers": { colors:["#F74902","#000000"], players:[
      { name:"Bobby Clarke", pos:["C"], off:88, def:84, phys:82, fo:86, clu:92 },
      { name:"Reggie Leach", pos:["RW"], off:90, def:50, phys:58, fo:25, clu:84 },
      { name:"Bill Barber", pos:["LW"], off:86, def:74, phys:72, fo:30, clu:84 },
      { name:"Orest Kindrachuk", pos:["C"], off:66, def:80, phys:74, fo:80, clu:74 },
      { name:"Don Saleski", pos:["RW"], off:60, def:74, phys:88, fo:30, clu:70 },
      { name:"Gary Dornhoefer", pos:["RW","LW"], off:68, def:72, phys:86, fo:35, clu:78 },
      { name:"Jimmy Watson", pos:["D"], off:60, def:86, phys:78, fo:0, clu:78 },
      { name:"Andre Dupont", pos:["D"], off:58, def:82, phys:88, fo:0, clu:76 },
      { name:"Bernie Parent", pos:["G"], off:0, def:95, phys:0, fo:0, clu:92 },
    ]},
    "Islanders": { colors:["#00539B","#F47D30"], players:[
      { name:"Bryan Trottier", pos:["C"], off:90, def:86, phys:78, fo:88, clu:90 },
      { name:"Mike Bossy", pos:["RW"], off:96, def:54, phys:50, fo:25, clu:92 },
      { name:"Clark Gillies", pos:["LW"], off:80, def:72, phys:90, fo:35, clu:84 },
      { name:"Lorne Henning", pos:["C"], off:58, def:82, phys:66, fo:80, clu:72 },
      { name:"Bob Bourne", pos:["C","LW"], off:74, def:78, phys:72, fo:74, clu:78 },
      { name:"Bob Nystrom", pos:["RW"], off:64, def:74, phys:88, fo:35, clu:84 },
      { name:"Denis Potvin", pos:["D"], off:90, def:92, phys:84, fo:0, clu:92 },
      { name:"Stefan Persson", pos:["D"], off:66, def:84, phys:70, fo:0, clu:78 },
      { name:"Billy Smith", pos:["G"], off:0, def:90, phys:0, fo:0, clu:92 },
    ]},
  },
  "1980s": {
    "Islanders": { colors:["#00539B","#F47D30"], players:[
      { name:"Bryan Trottier", pos:["C"], off:90, def:86, phys:78, fo:88, clu:92 },
      { name:"Mike Bossy", pos:["RW"], off:97, def:54, phys:50, fo:25, clu:94 },
      { name:"Clark Gillies", pos:["LW"], off:80, def:72, phys:90, fo:35, clu:84 },
      { name:"Butch Goring", pos:["C"], off:72, def:86, phys:64, fo:84, clu:88 },
      { name:"Bob Bourne", pos:["C","LW"], off:74, def:78, phys:72, fo:74, clu:78 },
      { name:"Bob Nystrom", pos:["RW"], off:64, def:74, phys:88, fo:35, clu:84 },
      { name:"Denis Potvin", pos:["D"], off:92, def:92, phys:84, fo:0, clu:94 },
      { name:"Ken Morrow", pos:["D"], off:58, def:88, phys:78, fo:0, clu:86 },
      { name:"Billy Smith", pos:["G"], off:0, def:91, phys:0, fo:0, clu:94 },
    ]},
    "Oilers": { colors:["#FF4C00","#041E42"], players:[
      { name:"Wayne Gretzky", pos:["C"], off:99, def:62, phys:45, fo:78, clu:96 },
      { name:"Jari Kurri", pos:["RW"], off:92, def:74, phys:58, fo:30, clu:90 },
      { name:"Mark Messier", pos:["C","LW"], off:90, def:80, phys:88, fo:82, clu:94 },
      { name:"Glenn Anderson", pos:["RW"], off:86, def:64, phys:74, fo:30, clu:88 },
      { name:"Dave Lumley", pos:["RW","LW"], off:62, def:72, phys:78, fo:35, clu:70 },
      { name:"Pat Hughes", pos:["RW"], off:64, def:70, phys:76, fo:35, clu:70 },
      { name:"Paul Coffey", pos:["D"], off:95, def:70, phys:62, fo:0, clu:88 },
      { name:"Kevin Lowe", pos:["D"], off:60, def:88, phys:80, fo:0, clu:84 },
      { name:"Grant Fuhr", pos:["G"], off:0, def:88, phys:0, fo:0, clu:90 },
    ]},
    "Flames": { colors:["#C8102E","#F1BE48"], players:[
      { name:"Kent Nilsson", pos:["C"], off:90, def:54, phys:48, fo:74, clu:78 },
      { name:"Lanny McDonald", pos:["RW"], off:86, def:62, phys:70, fo:30, clu:86 },
      { name:"Hakan Loob", pos:["RW","LW"], off:82, def:64, phys:54, fo:30, clu:78 },
      { name:"Doug Risebrough", pos:["C"], off:64, def:84, phys:82, fo:82, clu:80 },
      { name:"Jim Peplinski", pos:["C","RW"], off:62, def:78, phys:86, fo:70, clu:76 },
      { name:"Tim Hunter", pos:["RW"], off:48, def:72, phys:92, fo:30, clu:66 },
      { name:"Paul Reinhart", pos:["D"], off:82, def:74, phys:62, fo:0, clu:78 },
      { name:"Al MacInnis", pos:["D"], off:88, def:80, phys:78, fo:0, clu:86 },
      { name:"Mike Vernon", pos:["G"], off:0, def:84, phys:0, fo:0, clu:86 },
    ]},
    "Canadiens": { colors:["#AF1E2D","#192168"], players:[
      { name:"Bobby Smith", pos:["C"], off:84, def:74, phys:70, fo:82, clu:84 },
      { name:"Mats Naslund", pos:["LW"], off:86, def:64, phys:48, fo:30, clu:82 },
      { name:"Stephane Richer", pos:["RW"], off:84, def:58, phys:62, fo:30, clu:78 },
      { name:"Guy Carbonneau", pos:["C"], off:64, def:94, phys:74, fo:88, clu:88 },
      { name:"Bob Gainey", pos:["LW","C"], off:60, def:92, phys:80, fo:68, clu:84 },
      { name:"Chris Nilan", pos:["RW"], off:46, def:70, phys:96, fo:35, clu:66 },
      { name:"Larry Robinson", pos:["D"], off:78, def:92, phys:84, fo:0, clu:88 },
      { name:"Chris Chelios", pos:["D"], off:84, def:88, phys:86, fo:0, clu:88 },
      { name:"Patrick Roy", pos:["G"], off:0, def:94, phys:0, fo:0, clu:95 },
    ]},
    "Jets":      { colors:["#041E42","#004C97"], players:[
      { name:"Dale Hawerchuk", pos:["C"], off:93, def:60, phys:55, fo:82, clu:88 },
      { name:"Paul MacLean", pos:["RW"], off:82, def:58, phys:70, fo:30, clu:78 },
      { name:"Thomas Steen", pos:["C"], off:78, def:72, phys:62, fo:80, clu:76 },
      { name:"Doug Smail", pos:["LW"], off:72, def:66, phys:64, fo:35, clu:70 },
      { name:"Laurie Boschman", pos:["C","LW"], off:70, def:74, phys:80, fo:78, clu:72 },
      { name:"Brian Mullen", pos:["LW","RW"], off:76, def:62, phys:58, fo:32, clu:74 },
      { name:"Randy Carlyle", pos:["D"], off:74, def:82, phys:80, fo:0, clu:80 },
      { name:"Dave Babych", pos:["D"], off:78, def:76, phys:74, fo:0, clu:74 },
      { name:"David Ellett", pos:["D"], off:72, def:78, phys:70, fo:0, clu:72 },
      { name:"Brian Hayward", pos:["G"], off:0, def:80, phys:0, fo:0, clu:78 },
    ]},
  },
  "1990s": {
    "Penguins": { colors:["#000000","#FCB514"], players:[
      { name:"Mario Lemieux", pos:["C"], off:99, def:66, phys:60, fo:82, clu:96 },
      { name:"Jaromir Jagr", pos:["RW"], off:95, def:62, phys:74, fo:35, clu:92 },
      { name:"Kevin Stevens", pos:["LW"], off:88, def:60, phys:84, fo:30, clu:84 },
      { name:"Ron Francis", pos:["C"], off:86, def:86, phys:66, fo:90, clu:90 },
      { name:"Bryan Trottier", pos:["C"], off:70, def:84, phys:72, fo:84, clu:86 },
      { name:"Troy Loney", pos:["LW","RW"], off:56, def:74, phys:84, fo:35, clu:70 },
      { name:"Larry Murphy", pos:["D"], off:86, def:78, phys:64, fo:0, clu:84 },
      { name:"Ulf Samuelsson", pos:["D"], off:54, def:86, phys:92, fo:0, clu:80 },
      { name:"Tom Barrasso", pos:["G"], off:0, def:86, phys:0, fo:0, clu:86 },
    ]},
    "Red Wings": { colors:["#CE1126","#FFFFFF"], players:[
      { name:"Steve Yzerman", pos:["C"], off:94, def:78, phys:62, fo:84, clu:90 },
      { name:"Sergei Fedorov", pos:["C","RW"], off:92, def:90, phys:72, fo:82, clu:90 },
      { name:"Dino Ciccarelli", pos:["RW"], off:84, def:54, phys:74, fo:30, clu:82 },
      { name:"Kris Draper", pos:["C"], off:58, def:88, phys:74, fo:86, clu:80 },
      { name:"Darren McCarty", pos:["RW"], off:60, def:78, phys:90, fo:35, clu:80 },
      { name:"Shawn Burr", pos:["LW","C"], off:62, def:80, phys:78, fo:74, clu:72 },
      { name:"Nicklas Lidstrom", pos:["D"], off:88, def:94, phys:70, fo:0, clu:92 },
      { name:"Paul Coffey", pos:["D"], off:90, def:66, phys:58, fo:0, clu:84 },
      { name:"Chris Osgood", pos:["G"], off:0, def:84, phys:0, fo:0, clu:84 },
    ]},
    "Rangers": { colors:["#0038A8","#CE1126"], players:[
      { name:"Mark Messier", pos:["C","LW"], off:90, def:82, phys:88, fo:86, clu:96 },
      { name:"Adam Graves", pos:["LW"], off:84, def:74, phys:84, fo:35, clu:84 },
      { name:"Brian Leetch", pos:["D"], off:92, def:84, phys:64, fo:0, clu:92 },
      { name:"Sergei Nemchinov", pos:["C"], off:66, def:84, phys:68, fo:82, clu:76 },
      { name:"Esa Tikkanen", pos:["LW","C"], off:72, def:84, phys:80, fo:70, clu:84 },
      { name:"Jeff Beukeboom", pos:["D"], off:50, def:84, phys:90, fo:0, clu:76 },
      { name:"Kevin Lowe", pos:["D"], off:56, def:84, phys:80, fo:0, clu:82 },
      { name:"Steve Larmer", pos:["RW"], off:80, def:78, phys:62, fo:30, clu:84 },
      { name:"Mike Gartner", pos:["RW","LW"], off:84, def:64, phys:64, fo:30, clu:80 },
      { name:"Mike Richter", pos:["G"], off:0, def:90, phys:0, fo:0, clu:90 },
    ]},
    "Avalanche": { colors:["#6F263D","#236192"], players:[
      { name:"Joe Sakic", pos:["C"], off:94, def:76, phys:58, fo:84, clu:94 },
      { name:"Peter Forsberg", pos:["C"], off:93, def:86, phys:84, fo:86, clu:92 },
      { name:"Valeri Kamensky", pos:["LW"], off:84, def:60, phys:62, fo:30, clu:80 },
      { name:"Claude Lemieux", pos:["RW"], off:74, def:72, phys:88, fo:35, clu:90 },
      { name:"Mike Keane", pos:["RW"], off:60, def:84, phys:80, fo:40, clu:82 },
      { name:"Adam Deadmarsh", pos:["RW","C"], off:70, def:76, phys:82, fo:60, clu:78 },
      { name:"Sandis Ozolinsh", pos:["D"], off:88, def:64, phys:60, fo:0, clu:80 },
      { name:"Adam Foote", pos:["D"], off:56, def:90, phys:88, fo:0, clu:84 },
      { name:"Patrick Roy", pos:["G"], off:0, def:95, phys:0, fo:0, clu:97 },
    ]},
    "Stars": { colors:["#006847","#8F8F8C"], players:[
      { name:"Mike Modano", pos:["C"], off:90, def:82, phys:64, fo:84, clu:88 },
      { name:"Brett Hull", pos:["RW"], off:92, def:56, phys:58, fo:30, clu:90 },
      { name:"Jere Lehtinen", pos:["RW"], off:74, def:92, phys:66, fo:35, clu:84 },
      { name:"Guy Carbonneau", pos:["C"], off:58, def:92, phys:72, fo:90, clu:86 },
      { name:"Joe Nieuwendyk", pos:["C"], off:82, def:80, phys:64, fo:86, clu:88 },
      { name:"Jamie Langenbrunner", pos:["RW","LW","C"], off:72, def:78, phys:74, fo:62, clu:82 },
      { name:"Sergei Zubov", pos:["D"], off:88, def:80, phys:58, fo:0, clu:84 },
      { name:"Derian Hatcher", pos:["D"], off:58, def:90, phys:92, fo:0, clu:84 },
      { name:"Ed Belfour", pos:["G"], off:0, def:92, phys:0, fo:0, clu:90 },
    ]},
    "Jets":      { colors:["#041E42","#AC162C"], players:[
      { name:"Teemu Selanne", pos:["RW"], off:95, def:58, phys:55, fo:30, clu:88 },
      { name:"Keith Tkachuk", pos:["LW"], off:88, def:64, phys:90, fo:40, clu:84 },
      { name:"Alexei Zhamnov", pos:["C"], off:86, def:68, phys:62, fo:80, clu:80 },
      { name:"Phil Housley", pos:["D"], off:88, def:70, phys:58, fo:0, clu:80 },
      { name:"Ed Olczyk", pos:["C","LW"], off:78, def:64, phys:60, fo:76, clu:74 },
      { name:"Nelson Emerson", pos:["C","RW"], off:76, def:62, phys:56, fo:72, clu:72 },
      { name:"Teppo Numminen", pos:["D"], off:74, def:80, phys:66, fo:0, clu:76 },
      { name:"Fredrik Olausson", pos:["D"], off:72, def:74, phys:64, fo:0, clu:72 },
      { name:"Dave Manson", pos:["D"], off:64, def:80, phys:88, fo:0, clu:72 },
      { name:"Bob Essensa", pos:["G"], off:0, def:82, phys:0, fo:0, clu:78 },
    ]},
  },
  "2000s": {
    "Red Wings": { colors:["#CE1126","#FFFFFF"], players:[
      { name:"Steve Yzerman", pos:["C"], off:86, def:84, phys:62, fo:86, clu:92 },
      { name:"Sergei Fedorov", pos:["C","RW"], off:88, def:90, phys:70, fo:84, clu:88 },
      { name:"Brendan Shanahan", pos:["LW"], off:86, def:70, phys:84, fo:30, clu:88 },
      { name:"Kris Draper", pos:["C"], off:60, def:90, phys:76, fo:90, clu:82 },
      { name:"Kirk Maltby", pos:["RW"], off:54, def:88, phys:84, fo:35, clu:78 },
      { name:"Brett Hull", pos:["RW"], off:88, def:58, phys:56, fo:30, clu:90 },
      { name:"Nicklas Lidstrom", pos:["D"], off:90, def:97, phys:72, fo:0, clu:96 },
      { name:"Chris Chelios", pos:["D"], off:70, def:90, phys:88, fo:0, clu:88 },
      { name:"Dominik Hasek", pos:["G"], off:0, def:97, phys:0, fo:0, clu:92 },
    ]},
    "Devils": { colors:["#CE1126","#000000"], players:[
      { name:"Patrik Elias", pos:["LW","C"], off:88, def:82, phys:66, fo:74, clu:88 },
      { name:"Scott Gomez", pos:["C"], off:80, def:74, phys:60, fo:80, clu:82 },
      { name:"Jamie Langenbrunner", pos:["RW"], off:76, def:80, phys:74, fo:40, clu:86 },
      { name:"John Madden", pos:["C"], off:62, def:94, phys:70, fo:88, clu:86 },
      { name:"Jay Pandolfo", pos:["LW"], off:54, def:90, phys:68, fo:40, clu:80 },
      { name:"Bobby Holik", pos:["C","RW"], off:70, def:84, phys:88, fo:82, clu:80 },
      { name:"Scott Stevens", pos:["D"], off:64, def:96, phys:97, fo:0, clu:92 },
      { name:"Scott Niedermayer", pos:["D"], off:88, def:90, phys:66, fo:0, clu:92 },
      { name:"Martin Brodeur", pos:["G"], off:0, def:96, phys:0, fo:0, clu:94 },
    ]},
    "Lightning": { colors:["#002868","#FFFFFF"], players:[
      { name:"Vincent Lecavalier", pos:["C"], off:88, def:74, phys:74, fo:82, clu:86 },
      { name:"Martin St. Louis", pos:["RW"], off:92, def:74, phys:54, fo:35, clu:90 },
      { name:"Brad Richards", pos:["C"], off:86, def:72, phys:56, fo:80, clu:90 },
      { name:"Tim Taylor", pos:["C"], off:54, def:84, phys:72, fo:84, clu:74 },
      { name:"Dave Andreychuk", pos:["LW"], off:74, def:70, phys:80, fo:50, clu:86 },
      { name:"Ruslan Fedotenko", pos:["LW","RW"], off:70, def:74, phys:78, fo:40, clu:82 },
      { name:"Dan Boyle", pos:["D"], off:84, def:74, phys:58, fo:0, clu:82 },
      { name:"Pavel Kubina", pos:["D"], off:66, def:82, phys:84, fo:0, clu:78 },
      { name:"Nikolai Khabibulin", pos:["G"], off:0, def:88, phys:0, fo:0, clu:88 },
    ]},
    "Penguins": { colors:["#000000","#FCB514"], players:[
      { name:"Sidney Crosby", pos:["C"], off:96, def:84, phys:74, fo:88, clu:94 },
      { name:"Evgeni Malkin", pos:["C"], off:95, def:72, phys:78, fo:78, clu:92 },
      { name:"Marian Hossa", pos:["RW"], off:88, def:78, phys:68, fo:35, clu:84 },
      { name:"Jordan Staal", pos:["C"], off:72, def:92, phys:80, fo:84, clu:82 },
      { name:"Pascal Dupuis", pos:["RW","LW"], off:68, def:82, phys:70, fo:40, clu:78 },
      { name:"Maxime Talbot", pos:["C","LW"], off:58, def:80, phys:78, fo:74, clu:84 },
      { name:"Sergei Gonchar", pos:["D"], off:88, def:74, phys:62, fo:0, clu:84 },
      { name:"Brooks Orpik", pos:["D"], off:52, def:88, phys:92, fo:0, clu:82 },
      { name:"Marc-Andre Fleury", pos:["G"], off:0, def:88, phys:0, fo:0, clu:88 },
    ]},
    "Ducks": { colors:["#F47A38","#B09862"], players:[
      { name:"Ryan Getzlaf", pos:["C"], off:88, def:80, phys:84, fo:84, clu:88 },
      { name:"Corey Perry", pos:["RW"], off:86, def:66, phys:86, fo:35, clu:86 },
      { name:"Teemu Selanne", pos:["RW"], off:88, def:62, phys:56, fo:30, clu:88 },
      { name:"Samuel Pahlsson", pos:["C"], off:56, def:92, phys:80, fo:86, clu:82 },
      { name:"Rob Niedermayer", pos:["C","LW"], off:62, def:86, phys:80, fo:76, clu:80 },
      { name:"Travis Moen", pos:["LW"], off:52, def:80, phys:86, fo:35, clu:78 },
      { name:"Scott Niedermayer", pos:["D"], off:88, def:92, phys:68, fo:0, clu:92 },
      { name:"Chris Pronger", pos:["D"], off:80, def:94, phys:96, fo:0, clu:90 },
      { name:"Jean-Sebastien Giguere", pos:["G"], off:0, def:90, phys:0, fo:0, clu:90 },
    ]},
    "Maple Leafs": { colors:["#00205B","#FFFFFF"], players:[
      { name:"Mats Sundin", pos:["C"], off:91, def:74, phys:80, fo:86, clu:90 },
      { name:"Gary Roberts", pos:["LW"], off:80, def:72, phys:90, fo:40, clu:84 },
      { name:"Alexander Mogilny", pos:["RW"], off:88, def:60, phys:58, fo:30, clu:82 },
      { name:"Darcy Tucker", pos:["LW","RW"], off:76, def:66, phys:85, fo:42, clu:78 },
      { name:"Mikael Renberg", pos:["RW","LW"], off:74, def:64, phys:68, fo:35, clu:72 },
      { name:"Robert Reichel", pos:["C"], off:74, def:66, phys:58, fo:80, clu:72 },
      { name:"Bryan McCabe", pos:["D"], off:78, def:76, phys:84, fo:0, clu:76 },
      { name:"Tomas Kaberle", pos:["D"], off:82, def:74, phys:58, fo:0, clu:78 },
      { name:"Dmitry Yushkevich", pos:["D"], off:64, def:80, phys:78, fo:0, clu:72 },
      { name:"Curtis Joseph", pos:["G"], off:0, def:90, phys:0, fo:0, clu:90 },
    ]},
  },
  "2010s": {
    "Blackhawks": { colors:["#CF0A2C","#000000"], players:[
      { name:"Jonathan Toews", pos:["C"], off:90, def:92, phys:76, fo:88, clu:94 },
      { name:"Patrick Kane", pos:["RW"], off:94, def:64, phys:50, fo:35, clu:92 },
      { name:"Marian Hossa", pos:["RW","LW"], off:86, def:86, phys:74, fo:35, clu:86 },
      { name:"Dave Bolland", pos:["C"], off:64, def:86, phys:74, fo:82, clu:84 },
      { name:"Andrew Shaw", pos:["C","RW"], off:60, def:78, phys:88, fo:70, clu:82 },
      { name:"Bryan Bickell", pos:["LW"], off:66, def:72, phys:86, fo:35, clu:82 },
      { name:"Duncan Keith", pos:["D"], off:86, def:92, phys:72, fo:0, clu:92 },
      { name:"Brent Seabrook", pos:["D"], off:72, def:86, phys:84, fo:0, clu:88 },
      { name:"Corey Crawford", pos:["G"], off:0, def:88, phys:0, fo:0, clu:88 },
    ]},
    "Kings": { colors:["#111111","#A2AAAD"], players:[
      { name:"Anze Kopitar", pos:["C"], off:88, def:94, phys:76, fo:88, clu:90 },
      { name:"Jeff Carter", pos:["C","RW"], off:84, def:72, phys:66, fo:80, clu:84 },
      { name:"Dustin Brown", pos:["RW"], off:74, def:80, phys:92, fo:40, clu:88 },
      { name:"Mike Richards", pos:["C"], off:74, def:86, phys:80, fo:84, clu:86 },
      { name:"Jarret Stoll", pos:["C"], off:60, def:84, phys:74, fo:88, clu:80 },
      { name:"Kyle Clifford", pos:["LW"], off:48, def:74, phys:92, fo:35, clu:72 },
      { name:"Drew Doughty", pos:["D"], off:86, def:94, phys:82, fo:0, clu:92 },
      { name:"Jake Muzzin", pos:["D"], off:68, def:84, phys:80, fo:0, clu:80 },
      { name:"Jonathan Quick", pos:["G"], off:0, def:92, phys:0, fo:0, clu:94 },
    ]},
    "Bruins": { colors:["#FFB81C","#000000"], players:[
      { name:"Patrice Bergeron", pos:["C"], off:84, def:98, phys:78, fo:94, clu:92 },
      { name:"David Krejci", pos:["C"], off:84, def:80, phys:62, fo:80, clu:88 },
      { name:"Brad Marchand", pos:["LW"], off:82, def:84, phys:88, fo:40, clu:88 },
      { name:"Tyler Seguin", pos:["C","RW"], off:84, def:70, phys:60, fo:74, clu:80 },
      { name:"Chris Kelly", pos:["C"], off:58, def:86, phys:72, fo:82, clu:78 },
      { name:"Shawn Thornton", pos:["RW","LW"], off:46, def:74, phys:94, fo:35, clu:72 },
      { name:"Zdeno Chara", pos:["D"], off:70, def:96, phys:97, fo:0, clu:90 },
      { name:"Dennis Seidenberg", pos:["D"], off:60, def:86, phys:82, fo:0, clu:82 },
      { name:"Tuukka Rask", pos:["G"], off:0, def:92, phys:0, fo:0, clu:88 },
    ]},
    "Capitals": { colors:["#041E42","#C8102E"], players:[
      { name:"Nicklas Backstrom", pos:["C"], off:88, def:80, phys:62, fo:84, clu:86 },
      { name:"Alexander Ovechkin", pos:["LW"], off:96, def:58, phys:84, fo:30, clu:92 },
      { name:"T.J. Oshie", pos:["RW"], off:80, def:74, phys:80, fo:50, clu:88 },
      { name:"Lars Eller", pos:["C"], off:66, def:84, phys:74, fo:82, clu:84 },
      { name:"Tom Wilson", pos:["RW"], off:64, def:76, phys:94, fo:40, clu:82 },
      { name:"Brett Connolly", pos:["RW","LW"], off:68, def:70, phys:68, fo:35, clu:78 },
      { name:"John Carlson", pos:["D"], off:88, def:80, phys:68, fo:0, clu:86 },
      { name:"Matt Niskanen", pos:["D"], off:68, def:84, phys:74, fo:0, clu:80 },
      { name:"Braden Holtby", pos:["G"], off:0, def:90, phys:0, fo:0, clu:90 },
    ]},
    "Penguins": { colors:["#000000","#FCB514"], players:[
      { name:"Sidney Crosby", pos:["C"], off:96, def:84, phys:74, fo:90, clu:96 },
      { name:"Evgeni Malkin", pos:["C"], off:94, def:70, phys:78, fo:78, clu:92 },
      { name:"Phil Kessel", pos:["RW"], off:88, def:58, phys:50, fo:30, clu:88 },
      { name:"Nick Bonino", pos:["C"], off:68, def:84, phys:66, fo:82, clu:84 },
      { name:"Carl Hagelin", pos:["LW"], off:70, def:84, phys:64, fo:35, clu:82 },
      { name:"Bryan Rust", pos:["RW","LW"], off:74, def:80, phys:72, fo:40, clu:84 },
      { name:"Kris Letang", pos:["D"], off:90, def:80, phys:74, fo:0, clu:88 },
      { name:"Justin Schultz", pos:["D"], off:78, def:72, phys:58, fo:0, clu:78 },
      { name:"Matt Murray", pos:["G"], off:0, def:88, phys:0, fo:0, clu:90 },
    ]},
  },
  "2020s": {
    "Avalanche":  { colors:["#6F263D","#236192"], players:[
      { name:"Nathan MacKinnon", pos:["C"], off:97, def:78, phys:74, fo:82, clu:92 },
      { name:"Mikko Rantanen", pos:["RW"], off:92, def:70, phys:76, fo:35, clu:88 },
      { name:"Gabriel Landeskog", pos:["LW"], off:84, def:80, phys:88, fo:40, clu:90 },
      { name:"Valeri Nichushkin", pos:["RW","LW"], off:82, def:84, phys:82, fo:40, clu:86 },
      { name:"J.T. Compher", pos:["C"], off:68, def:82, phys:70, fo:80, clu:80 },
      { name:"Andrew Cogliano", pos:["C","LW"], off:56, def:86, phys:72, fo:74, clu:80 },
      { name:"Cale Makar", pos:["D"], off:96, def:88, phys:72, fo:0, clu:92 },
      { name:"Devon Toews", pos:["D"], off:80, def:88, phys:70, fo:0, clu:84 },
      { name:"Darcy Kuemper", pos:["G"], off:0, def:88, phys:0, fo:0, clu:84 },
    ]},
    "Lightning":  { colors:["#002868","#FFFFFF"], players:[
      { name:"Brayden Point", pos:["C"], off:90, def:82, phys:60, fo:84, clu:92 },
      { name:"Nikita Kucherov", pos:["RW"], off:97, def:64, phys:58, fo:35, clu:94 },
      { name:"Steven Stamkos", pos:["C","LW"], off:90, def:66, phys:62, fo:82, clu:90 },
      { name:"Anthony Cirelli", pos:["C"], off:70, def:94, phys:74, fo:86, clu:88 },
      { name:"Brandon Hagel", pos:["LW","RW"], off:82, def:84, phys:74, fo:40, clu:84 },
      { name:"Blake Coleman", pos:["RW","LW"], off:68, def:88, phys:82, fo:45, clu:86 },
      { name:"Victor Hedman", pos:["D"], off:90, def:92, phys:84, fo:0, clu:92 },
      { name:"Ryan McDonagh", pos:["D"], off:66, def:88, phys:80, fo:0, clu:86 },
      { name:"Andrei Vasilevskiy", pos:["G"], off:0, def:96, phys:0, fo:0, clu:94 },
    ]},
    "Golden Knights": { colors:["#B4975A","#333F42"], players:[
      { name:"Jack Eichel", pos:["C"], off:90, def:76, phys:68, fo:82, clu:86 },
      { name:"Mark Stone", pos:["RW"], off:86, def:92, phys:74, fo:40, clu:92 },
      { name:"Jonathan Marchessault", pos:["LW","RW"], off:84, def:70, phys:62, fo:35, clu:90 },
      { name:"William Karlsson", pos:["C"], off:78, def:88, phys:68, fo:86, clu:84 },
      { name:"Ivan Barbashev", pos:["LW","C"], off:72, def:80, phys:82, fo:70, clu:84 },
      { name:"Keegan Kolesar", pos:["RW"], off:54, def:74, phys:92, fo:40, clu:74 },
      { name:"Alex Pietrangelo", pos:["D"], off:84, def:90, phys:78, fo:0, clu:90 },
      { name:"Shea Theodore", pos:["D"], off:86, def:78, phys:62, fo:0, clu:82 },
      { name:"Adin Hill", pos:["G"], off:0, def:90, phys:0, fo:0, clu:90 },
    ]},
    "Panthers":   { colors:["#C8102E","#B9975B"], players:[
      { name:"Aleksander Barkov", pos:["C"], off:90, def:96, phys:74, fo:90, clu:92 },
      { name:"Matthew Tkachuk", pos:["LW","RW"], off:90, def:78, phys:92, fo:40, clu:92 },
      { name:"Sam Reinhart", pos:["RW","C"], off:88, def:78, phys:62, fo:80, clu:88 },
      { name:"Sam Bennett", pos:["C","LW"], off:74, def:80, phys:90, fo:78, clu:88 },
      { name:"Carter Verhaeghe", pos:["LW","C"], off:84, def:72, phys:66, fo:62, clu:88 },
      { name:"Eetu Luostarinen", pos:["C","LW"], off:64, def:86, phys:74, fo:74, clu:80 },
      { name:"Gustav Forsling", pos:["D"], off:78, def:92, phys:78, fo:0, clu:88 },
      { name:"Aaron Ekblad", pos:["D"], off:78, def:84, phys:82, fo:0, clu:84 },
      { name:"Sergei Bobrovsky", pos:["G"], off:0, def:92, phys:0, fo:0, clu:92 },
    ]},
    "Oilers":     { colors:["#FF4C00","#041E42"], players:[
      { name:"Connor McDavid", pos:["C"], off:99, def:74, phys:62, fo:82, clu:92 },
      { name:"Leon Draisaitl", pos:["C","LW"], off:96, def:70, phys:74, fo:84, clu:90 },
      { name:"Zach Hyman", pos:["LW","RW"], off:84, def:80, phys:84, fo:40, clu:86 },
      { name:"Ryan Nugent-Hopkins", pos:["C","LW"], off:80, def:82, phys:60, fo:80, clu:82 },
      { name:"Adam Henrique", pos:["C"], off:68, def:80, phys:66, fo:80, clu:78 },
      { name:"Connor Brown", pos:["RW","LW"], off:64, def:80, phys:68, fo:40, clu:78 },
      { name:"Evan Bouchard", pos:["D"], off:88, def:74, phys:66, fo:0, clu:84 },
      { name:"Mattias Ekholm", pos:["D"], off:70, def:90, phys:80, fo:0, clu:86 },
      { name:"Stuart Skinner", pos:["G"], off:0, def:84, phys:0, fo:0, clu:82 },
    ]},
    "Rangers":    { colors:["#0038A8","#CE1126"], players:[
      { name:"Artemi Panarin", pos:["LW"], off:94, def:68, phys:54, fo:30, clu:88 },
      { name:"Mika Zibanejad", pos:["C"], off:86, def:78, phys:68, fo:84, clu:84 },
      { name:"Vincent Trocheck", pos:["C"], off:80, def:82, phys:74, fo:86, clu:84 },
      { name:"Chris Kreider", pos:["LW"], off:84, def:74, phys:82, fo:40, clu:88 },
      { name:"Alexis Lafreniere", pos:["LW","RW"], off:78, def:74, phys:70, fo:40, clu:80 },
      { name:"Barclay Goodrow", pos:["C","RW"], off:58, def:86, phys:84, fo:72, clu:82 },
      { name:"Adam Fox", pos:["D"], off:90, def:88, phys:66, fo:0, clu:88 },
      { name:"Jacob Trouba", pos:["D"], off:62, def:84, phys:90, fo:0, clu:80 },
      { name:"Igor Shesterkin", pos:["G"], off:0, def:96, phys:0, fo:0, clu:92 },
    ]},
    "Stars":      { colors:["#006847","#8F8F8C"], players:[
      { name:"Jason Robertson", pos:["LW"], off:90, def:74, phys:66, fo:35, clu:84 },
      { name:"Roope Hintz", pos:["C"], off:86, def:82, phys:70, fo:82, clu:84 },
      { name:"Wyatt Johnston", pos:["C","RW"], off:80, def:78, phys:66, fo:78, clu:82 },
      { name:"Matt Duchene", pos:["C"], off:82, def:74, phys:60, fo:80, clu:80 },
      { name:"Tyler Seguin", pos:["C","RW"], off:78, def:74, phys:62, fo:78, clu:80 },
      { name:"Mason Marchment", pos:["LW","RW"], off:74, def:74, phys:84, fo:40, clu:78 },
      { name:"Miro Heiskanen", pos:["D"], off:88, def:90, phys:70, fo:0, clu:88 },
      { name:"Thomas Harley", pos:["D"], off:78, def:80, phys:66, fo:0, clu:80 },
      { name:"Jake Oettinger", pos:["G"], off:0, def:90, phys:0, fo:0, clu:88 },
    ]},
    "Hurricanes": { colors:["#CC0000","#000000"], players:[
      { name:"Sebastian Aho", pos:["C"], off:88, def:84, phys:66, fo:86, clu:86 },
      { name:"Andrei Svechnikov", pos:["LW","RW"], off:84, def:72, phys:80, fo:40, clu:82 },
      { name:"Seth Jarvis", pos:["RW","C"], off:80, def:82, phys:68, fo:62, clu:82 },
      { name:"Jordan Staal", pos:["C"], off:62, def:92, phys:82, fo:88, clu:84 },
      { name:"Jordan Martinook", pos:["LW","C"], off:60, def:86, phys:82, fo:60, clu:82 },
      { name:"Jesperi Kotkaniemi", pos:["C"], off:66, def:78, phys:70, fo:80, clu:74 },
      { name:"Jaccob Slavin", pos:["D"], off:72, def:94, phys:74, fo:0, clu:88 },
      { name:"Brent Burns", pos:["D"], off:84, def:74, phys:80, fo:0, clu:82 },
      { name:"Frederik Andersen", pos:["G"], off:0, def:90, phys:0, fo:0, clu:84 },
    ]},
    "Maple Leafs": { colors:["#00205B","#FFFFFF"], players:[
      { name:"Auston Matthews", pos:["C"], off:96, def:84, phys:72, fo:86, clu:86 },
      { name:"Mitch Marner", pos:["RW"], off:92, def:82, phys:54, fo:35, clu:82 },
      { name:"William Nylander", pos:["RW","C"], off:90, def:70, phys:62, fo:74, clu:84 },
      { name:"John Tavares", pos:["C"], off:84, def:74, phys:68, fo:86, clu:84 },
      { name:"Max Domi", pos:["C","LW"], off:74, def:70, phys:74, fo:72, clu:78 },
      { name:"David Kampf", pos:["C"], off:54, def:88, phys:70, fo:84, clu:78 },
      { name:"Morgan Rielly", pos:["D"], off:84, def:76, phys:64, fo:0, clu:82 },
      { name:"Jake McCabe", pos:["D"], off:62, def:86, phys:82, fo:0, clu:80 },
      { name:"Joseph Woll", pos:["G"], off:0, def:86, phys:0, fo:0, clu:82 },
    ]},
    "Bruins":     { colors:["#FFB81C","#000000"], players:[
      { name:"David Pastrnak", pos:["RW"], off:94, def:70, phys:66, fo:35, clu:88 },
      { name:"Brad Marchand", pos:["LW"], off:84, def:84, phys:88, fo:40, clu:90 },
      { name:"Pavel Zacha", pos:["C","LW"], off:78, def:80, phys:70, fo:80, clu:80 },
      { name:"Charlie Coyle", pos:["C"], off:72, def:84, phys:78, fo:84, clu:82 },
      { name:"Trent Frederic", pos:["C","LW"], off:66, def:80, phys:88, fo:70, clu:78 },
      { name:"Morgan Geekie", pos:["C","RW"], off:70, def:74, phys:74, fo:74, clu:76 },
      { name:"Charlie McAvoy", pos:["D"], off:84, def:90, phys:82, fo:0, clu:86 },
      { name:"Hampus Lindholm", pos:["D"], off:74, def:90, phys:78, fo:0, clu:84 },
      { name:"Jeremy Swayman", pos:["G"], off:0, def:92, phys:0, fo:0, clu:88 },
    ]},
    "Devils":     { colors:["#CE1126","#000000"], players:[
      { name:"Jack Hughes", pos:["C"], off:94, def:74, phys:56, fo:78, clu:84 },
      { name:"Jesper Bratt", pos:["LW","RW"], off:86, def:76, phys:58, fo:35, clu:82 },
      { name:"Nico Hischier", pos:["C"], off:84, def:90, phys:70, fo:86, clu:86 },
      { name:"Timo Meier", pos:["RW","LW"], off:84, def:70, phys:82, fo:40, clu:82 },
      { name:"Ondrej Palat", pos:["LW"], off:70, def:82, phys:72, fo:40, clu:86 },
      { name:"Erik Haula", pos:["C"], off:66, def:80, phys:70, fo:82, clu:78 },
      { name:"Dougie Hamilton", pos:["D"], off:88, def:74, phys:74, fo:0, clu:80 },
      { name:"Luke Hughes", pos:["D"], off:80, def:76, phys:62, fo:0, clu:78 },
      { name:"Jacob Markstrom", pos:["G"], off:0, def:88, phys:0, fo:0, clu:84 },
    ]},
    "Jets":       { colors:["#041E42","#004C97"], players:[
      { name:"Kyle Connor", pos:["LW"], off:90, def:66, phys:56, fo:35, clu:84 },
      { name:"Mark Scheifele", pos:["C"], off:86, def:72, phys:64, fo:84, clu:84 },
      { name:"Gabriel Vilardi", pos:["C","RW"], off:78, def:76, phys:72, fo:78, clu:80 },
      { name:"Adam Lowry", pos:["C"], off:60, def:90, phys:88, fo:82, clu:84 },
      { name:"Nino Niederreiter", pos:["RW","LW"], off:70, def:80, phys:80, fo:40, clu:80 },
      { name:"Vladislav Namestnikov", pos:["C"], off:64, def:78, phys:64, fo:80, clu:76 },
      { name:"Josh Morrissey", pos:["D"], off:86, def:84, phys:72, fo:0, clu:84 },
      { name:"Dylan DeMelo", pos:["D"], off:62, def:84, phys:70, fo:0, clu:78 },
      { name:"Connor Hellebuyck", pos:["G"], off:0, def:97, phys:0, fo:0, clu:90 },
    ]},
    "Kraken":     { colors:["#001628","#99D9D9"], players:[
      { name:"Matty Beniers", pos:["C"], off:80, def:82, phys:64, fo:84, clu:80 },
      { name:"Jared McCann", pos:["LW","C"], off:84, def:70, phys:62, fo:70, clu:80 },
      { name:"Jordan Eberle", pos:["RW"], off:78, def:72, phys:56, fo:35, clu:82 },
      { name:"Yanni Gourde", pos:["C","LW"], off:72, def:86, phys:80, fo:74, clu:84 },
      { name:"Jaden Schwartz", pos:["LW"], off:74, def:80, phys:72, fo:40, clu:82 },
      { name:"Eeli Tolvanen", pos:["RW","LW"], off:72, def:72, phys:66, fo:40, clu:74 },
      { name:"Vince Dunn", pos:["D"], off:84, def:74, phys:66, fo:0, clu:78 },
      { name:"Adam Larsson", pos:["D"], off:60, def:86, phys:82, fo:0, clu:78 },
      { name:"Joey Daccord", pos:["G"], off:0, def:86, phys:0, fo:0, clu:80 },
    ]},
    "Kings":      { colors:["#111111","#A2AAAD"], players:[
      { name:"Anze Kopitar", pos:["C"], off:84, def:92, phys:72, fo:88, clu:88 },
      { name:"Adrian Kempe", pos:["RW","C"], off:84, def:74, phys:72, fo:74, clu:82 },
      { name:"Kevin Fiala", pos:["LW","C"], off:86, def:66, phys:60, fo:60, clu:80 },
      { name:"Phillip Danault", pos:["C"], off:66, def:92, phys:74, fo:88, clu:84 },
      { name:"Trevor Moore", pos:["LW","RW"], off:70, def:82, phys:70, fo:40, clu:80 },
      { name:"Quinton Byfield", pos:["C","LW"], off:78, def:74, phys:78, fo:74, clu:78 },
      { name:"Drew Doughty", pos:["D"], off:80, def:90, phys:80, fo:0, clu:90 },
      { name:"Mikey Anderson", pos:["D"], off:58, def:86, phys:78, fo:0, clu:78 },
      { name:"Darcy Kuemper", pos:["G"], off:0, def:86, phys:0, fo:0, clu:82 },
    ]},
    "Canucks":    { colors:["#00205B","#00843D"], players:[
      { name:"Elias Pettersson", pos:["C"], off:88, def:82, phys:62, fo:84, clu:82 },
      { name:"J.T. Miller", pos:["C","LW"], off:86, def:78, phys:80, fo:84, clu:86 },
      { name:"Brock Boeser", pos:["RW"], off:84, def:64, phys:58, fo:35, clu:82 },
      { name:"Conor Garland", pos:["RW","LW"], off:74, def:78, phys:72, fo:40, clu:78 },
      { name:"Pius Suter", pos:["C"], off:66, def:82, phys:64, fo:80, clu:76 },
      { name:"Dakota Joshua", pos:["LW","C"], off:64, def:78, phys:84, fo:62, clu:76 },
      { name:"Quinn Hughes", pos:["D"], off:94, def:84, phys:60, fo:0, clu:88 },
      { name:"Filip Hronek", pos:["D"], off:76, def:80, phys:68, fo:0, clu:78 },
      { name:"Thatcher Demko", pos:["G"], off:0, def:92, phys:0, fo:0, clu:86 },
    ]},
    "Flames":     { colors:["#C8102E","#F1BE48"], players:[
      { name:"Nazem Kadri", pos:["C"], off:82, def:74, phys:80, fo:82, clu:84 },
      { name:"Jonathan Huberdeau", pos:["LW"], off:80, def:66, phys:54, fo:35, clu:80 },
      { name:"Blake Coleman", pos:["RW","LW"], off:72, def:86, phys:82, fo:45, clu:84 },
      { name:"Mikael Backlund", pos:["C"], off:68, def:90, phys:74, fo:86, clu:82 },
      { name:"Yegor Sharangovich", pos:["LW","C"], off:74, def:72, phys:66, fo:62, clu:76 },
      { name:"Andrew Mangiapane", pos:["LW"], off:72, def:76, phys:72, fo:40, clu:78 },
      { name:"MacKenzie Weegar", pos:["D"], off:78, def:84, phys:78, fo:0, clu:80 },
      { name:"Rasmus Andersson", pos:["D"], off:76, def:82, phys:74, fo:0, clu:80 },
      { name:"Dustin Wolf", pos:["G"], off:0, def:86, phys:0, fo:0, clu:80 },
    ]},
    "Predators":  { colors:["#FFB81C","#041E42"], players:[
      { name:"Filip Forsberg", pos:["LW","RW"], off:88, def:72, phys:70, fo:40, clu:86 },
      { name:"Ryan O'Reilly", pos:["C"], off:78, def:88, phys:72, fo:90, clu:88 },
      { name:"Roman Josi", pos:["D"], off:92, def:86, phys:72, fo:0, clu:88 },
      { name:"Steven Stamkos", pos:["C","LW"], off:82, def:64, phys:60, fo:80, clu:86 },
      { name:"Gustav Nyquist", pos:["RW","C"], off:74, def:76, phys:62, fo:62, clu:80 },
      { name:"Colton Sissons", pos:["C","RW"], off:60, def:84, phys:78, fo:80, clu:78 },
      { name:"Tommy Novak", pos:["C","LW"], off:72, def:70, phys:60, fo:76, clu:74 },
      { name:"Brady Skjei", pos:["D"], off:72, def:82, phys:76, fo:0, clu:78 },
      { name:"Alexandre Carrier", pos:["D"], off:60, def:82, phys:72, fo:0, clu:76 },
      { name:"Juuse Saros", pos:["G"], off:0, def:92, phys:0, fo:0, clu:86 },
    ]},
    "Wild":       { colors:["#154734","#A6192E"], players:[
      { name:"Kirill Kaprizov", pos:["LW"], off:94, def:72, phys:68, fo:35, clu:88 },
      { name:"Matt Boldy", pos:["LW","RW"], off:82, def:74, phys:70, fo:40, clu:82 },
      { name:"Joel Eriksson Ek", pos:["C"], off:78, def:92, phys:86, fo:86, clu:86 },
      { name:"Marco Rossi", pos:["C"], off:74, def:80, phys:60, fo:80, clu:78 },
      { name:"Marcus Foligno", pos:["LW"], off:58, def:84, phys:92, fo:40, clu:80 },
      { name:"Frederick Gaudreau", pos:["C"], off:62, def:82, phys:66, fo:82, clu:78 },
      { name:"Brock Faber", pos:["D"], off:78, def:86, phys:74, fo:0, clu:82 },
      { name:"Jonas Brodin", pos:["D"], off:62, def:90, phys:74, fo:0, clu:82 },
      { name:"Filip Gustavsson", pos:["G"], off:0, def:88, phys:0, fo:0, clu:82 },
    ]},
    "Capitals":   { colors:["#041E42","#C8102E"], players:[
      { name:"Alexander Ovechkin", pos:["LW"], off:90, def:56, phys:80, fo:30, clu:90 },
      { name:"Dylan Strome", pos:["C"], off:80, def:72, phys:62, fo:80, clu:80 },
      { name:"Tom Wilson", pos:["RW"], off:74, def:78, phys:94, fo:40, clu:84 },
      { name:"Pierre-Luc Dubois", pos:["C"], off:74, def:78, phys:78, fo:82, clu:78 },
      { name:"Connor McMichael", pos:["C","LW"], off:74, def:74, phys:62, fo:70, clu:76 },
      { name:"Nic Dowd", pos:["C"], off:56, def:86, phys:76, fo:84, clu:78 },
      { name:"John Carlson", pos:["D"], off:82, def:76, phys:70, fo:0, clu:84 },
      { name:"Jakob Chychrun", pos:["D"], off:78, def:78, phys:74, fo:0, clu:78 },
      { name:"Charlie Lindgren", pos:["G"], off:0, def:88, phys:0, fo:0, clu:82 },
    ]},
    "Penguins":   { colors:["#000000","#FCB514"], players:[
      { name:"Sidney Crosby", pos:["C"], off:92, def:84, phys:74, fo:90, clu:94 },
      { name:"Evgeni Malkin", pos:["C"], off:84, def:66, phys:74, fo:76, clu:88 },
      { name:"Rickard Rakell", pos:["LW","RW"], off:80, def:72, phys:66, fo:40, clu:80 },
      { name:"Bryan Rust", pos:["RW","LW"], off:80, def:80, phys:70, fo:40, clu:84 },
      { name:"Lars Eller", pos:["C"], off:60, def:82, phys:72, fo:82, clu:80 },
      { name:"Noel Acciari", pos:["C","RW"], off:56, def:82, phys:84, fo:74, clu:76 },
      { name:"Kris Letang", pos:["D"], off:84, def:74, phys:74, fo:0, clu:84 },
      { name:"Erik Karlsson", pos:["D"], off:88, def:68, phys:60, fo:0, clu:80 },
      { name:"Tristan Jarry", pos:["G"], off:0, def:84, phys:0, fo:0, clu:80 },
    ]},
    "Red Wings":  { colors:["#CE1126","#FFFFFF"], players:[
      { name:"Dylan Larkin", pos:["C"], off:86, def:80, phys:72, fo:84, clu:84 },
      { name:"Lucas Raymond", pos:["RW","LW"], off:84, def:74, phys:62, fo:40, clu:82 },
      { name:"Alex DeBrincat", pos:["RW","LW"], off:84, def:64, phys:54, fo:35, clu:82 },
      { name:"J.T. Compher", pos:["C"], off:68, def:80, phys:68, fo:80, clu:78 },
      { name:"Andrew Copp", pos:["C","LW"], off:66, def:84, phys:74, fo:82, clu:80 },
      { name:"Michael Rasmussen", pos:["C","LW"], off:64, def:82, phys:82, fo:78, clu:78 },
      { name:"Moritz Seider", pos:["D"], off:78, def:88, phys:80, fo:0, clu:84 },
      { name:"Ben Chiarot", pos:["D"], off:58, def:82, phys:84, fo:0, clu:78 },
      { name:"Cam Talbot", pos:["G"], off:0, def:86, phys:0, fo:0, clu:82 },
    ]},
    "Sabres":     { colors:["#003087","#FFB81C"], players:[
      { name:"Tage Thompson", pos:["C","RW"], off:88, def:72, phys:80, fo:80, clu:80 },
      { name:"Rasmus Dahlin", pos:["D"], off:88, def:86, phys:76, fo:0, clu:84 },
      { name:"Alex Tuch", pos:["RW","LW"], off:82, def:78, phys:80, fo:40, clu:82 },
      { name:"Dylan Cozens", pos:["C"], off:76, def:76, phys:72, fo:80, clu:78 },
      { name:"Jason Zucker", pos:["LW"], off:72, def:70, phys:68, fo:40, clu:78 },
      { name:"Peyton Krebs", pos:["C"], off:60, def:78, phys:64, fo:78, clu:74 },
      { name:"Jack Quinn", pos:["RW","LW"], off:74, def:68, phys:60, fo:40, clu:74 },
      { name:"Owen Power", pos:["D"], off:78, def:80, phys:70, fo:0, clu:78 },
      { name:"Bowen Byram", pos:["D"], off:78, def:78, phys:68, fo:0, clu:78 },
      { name:"Ukko-Pekka Luukkonen", pos:["G"], off:0, def:84, phys:0, fo:0, clu:78 },
    ]},
    "Senators":   { colors:["#C8102E","#000000"], players:[
      { name:"Brady Tkachuk", pos:["LW"], off:84, def:74, phys:92, fo:40, clu:84 },
      { name:"Tim Stutzle", pos:["C","LW"], off:88, def:72, phys:64, fo:78, clu:82 },
      { name:"Drake Batherson", pos:["RW"], off:80, def:72, phys:62, fo:35, clu:80 },
      { name:"Josh Norris", pos:["C"], off:76, def:78, phys:66, fo:82, clu:78 },
      { name:"Shane Pinto", pos:["C"], off:68, def:84, phys:72, fo:84, clu:78 },
      { name:"David Perron", pos:["RW","LW"], off:72, def:72, phys:72, fo:40, clu:82 },
      { name:"Jake Sanderson", pos:["D"], off:80, def:86, phys:74, fo:0, clu:82 },
      { name:"Thomas Chabot", pos:["D"], off:82, def:74, phys:68, fo:0, clu:78 },
      { name:"Linus Ullmark", pos:["G"], off:0, def:90, phys:0, fo:0, clu:84 },
    ]},
    "Islanders":  { colors:["#00539B","#F47D30"], players:[
      { name:"Mathew Barzal", pos:["C"], off:86, def:74, phys:60, fo:78, clu:82 },
      { name:"Bo Horvat", pos:["C"], off:80, def:80, phys:74, fo:86, clu:82 },
      { name:"Brock Nelson", pos:["C","LW"], off:80, def:78, phys:70, fo:82, clu:82 },
      { name:"Anders Lee", pos:["LW"], off:74, def:78, phys:84, fo:40, clu:82 },
      { name:"Kyle Palmieri", pos:["RW"], off:74, def:72, phys:68, fo:40, clu:80 },
      { name:"Casey Cizikas", pos:["C"], off:54, def:88, phys:84, fo:82, clu:80 },
      { name:"Noah Dobson", pos:["D"], off:84, def:80, phys:70, fo:0, clu:80 },
      { name:"Adam Pelech", pos:["D"], off:62, def:90, phys:78, fo:0, clu:82 },
      { name:"Ilya Sorokin", pos:["G"], off:0, def:94, phys:0, fo:0, clu:88 },
    ]},
    "Flyers":     { colors:["#F74902","#000000"], players:[
      { name:"Travis Konecny", pos:["RW","LW"], off:84, def:78, phys:74, fo:40, clu:82 },
      { name:"Sean Couturier", pos:["C"], off:72, def:90, phys:74, fo:86, clu:84 },
      { name:"Owen Tippett", pos:["RW","LW"], off:78, def:68, phys:72, fo:40, clu:76 },
      { name:"Travis Sanheim", pos:["D"], off:74, def:82, phys:74, fo:0, clu:78 },
      { name:"Morgan Frost", pos:["C"], off:72, def:72, phys:58, fo:78, clu:76 },
      { name:"Scott Laughton", pos:["C","LW"], off:64, def:82, phys:78, fo:80, clu:78 },
      { name:"Bobby Brink", pos:["RW","LW"], off:70, def:70, phys:58, fo:40, clu:72 },
      { name:"Nick Seeler", pos:["D"], off:54, def:84, phys:82, fo:0, clu:76 },
      { name:"Cam York", pos:["D"], off:70, def:78, phys:62, fo:0, clu:76 },
      { name:"Samuel Ersson", pos:["G"], off:0, def:84, phys:0, fo:0, clu:78 },
    ]},
    "Blues":      { colors:["#002F87","#FCB514"], players:[
      { name:"Robert Thomas", pos:["C"], off:84, def:80, phys:60, fo:84, clu:82 },
      { name:"Jordan Kyrou", pos:["RW","C"], off:84, def:66, phys:58, fo:70, clu:80 },
      { name:"Pavel Buchnevich", pos:["LW","RW"], off:82, def:78, phys:68, fo:40, clu:82 },
      { name:"Brayden Schenn", pos:["C"], off:74, def:80, phys:82, fo:84, clu:82 },
      { name:"Jake Neighbours", pos:["LW"], off:70, def:74, phys:74, fo:40, clu:76 },
      { name:"Oskar Sundqvist", pos:["C","RW"], off:58, def:82, phys:82, fo:80, clu:76 },
      { name:"Colton Parayko", pos:["D"], off:72, def:88, phys:84, fo:0, clu:82 },
      { name:"Justin Faulk", pos:["D"], off:78, def:80, phys:72, fo:0, clu:80 },
      { name:"Jordan Binnington", pos:["G"], off:0, def:86, phys:0, fo:0, clu:88 },
    ]},
    "Ducks":      { colors:["#F47A38","#B09862"], players:[
      { name:"Troy Terry", pos:["RW","C"], off:80, def:74, phys:60, fo:62, clu:80 },
      { name:"Mason McTavish", pos:["C"], off:78, def:76, phys:76, fo:80, clu:78 },
      { name:"Frank Vatrano", pos:["LW","RW"], off:78, def:66, phys:64, fo:40, clu:78 },
      { name:"Leo Carlsson", pos:["C"], off:76, def:74, phys:66, fo:78, clu:76 },
      { name:"Alex Killorn", pos:["LW","RW"], off:72, def:76, phys:70, fo:50, clu:84 },
      { name:"Isac Lundestrom", pos:["C"], off:58, def:82, phys:70, fo:80, clu:74 },
      { name:"Pavel Mintyukov", pos:["D"], off:74, def:74, phys:66, fo:0, clu:74 },
      { name:"Radko Gudas", pos:["D"], off:54, def:82, phys:90, fo:0, clu:78 },
      { name:"Lukas Dostal", pos:["G"], off:0, def:84, phys:0, fo:0, clu:78 },
    ]},
    "Sharks":     { colors:["#006D75","#EA7200"], players:[
      { name:"Macklin Celebrini", pos:["C"], off:82, def:76, phys:64, fo:80, clu:78 },
      { name:"Tyler Toffoli", pos:["RW","LW"], off:80, def:68, phys:62, fo:40, clu:82 },
      { name:"William Eklund", pos:["LW","C"], off:76, def:72, phys:58, fo:62, clu:76 },
      { name:"Mikael Granlund", pos:["C","LW"], off:74, def:74, phys:60, fo:80, clu:78 },
      { name:"Fabian Zetterlund", pos:["RW","LW"], off:70, def:72, phys:70, fo:40, clu:74 },
      { name:"Barclay Goodrow", pos:["C","RW"], off:58, def:82, phys:82, fo:72, clu:80 },
      { name:"Jake Walman", pos:["D"], off:74, def:78, phys:70, fo:0, clu:76 },
      { name:"Mario Ferraro", pos:["D"], off:58, def:82, phys:78, fo:0, clu:76 },
      { name:"Mackenzie Blackwood", pos:["G"], off:0, def:82, phys:0, fo:0, clu:76 },
    ]},
    "Blue Jackets": { colors:["#002654","#CE1126"], players:[
      { name:"Johnny Gaudreau", pos:["LW"], off:86, def:64, phys:48, fo:35, clu:82 },
      { name:"Sean Monahan", pos:["C"], off:76, def:78, phys:62, fo:84, clu:80 },
      { name:"Kirill Marchenko", pos:["RW","LW"], off:78, def:68, phys:64, fo:40, clu:76 },
      { name:"Boone Jenner", pos:["C"], off:70, def:84, phys:86, fo:84, clu:82 },
      { name:"Adam Fantilli", pos:["C"], off:78, def:72, phys:70, fo:78, clu:76 },
      { name:"Cole Sillinger", pos:["C","LW"], off:64, def:78, phys:72, fo:78, clu:74 },
      { name:"Zach Werenski", pos:["D"], off:88, def:82, phys:72, fo:0, clu:84 },
      { name:"Damon Severson", pos:["D"], off:68, def:78, phys:72, fo:0, clu:76 },
      { name:"Elvis Merzlikins", pos:["G"], off:0, def:82, phys:0, fo:0, clu:76 },
    ]},
    "Canadiens":  { colors:["#AF1E2D","#192168"], players:[
      { name:"Nick Suzuki", pos:["C"], off:84, def:82, phys:62, fo:84, clu:84 },
      { name:"Cole Caufield", pos:["RW"], off:84, def:62, phys:50, fo:35, clu:82 },
      { name:"Juraj Slafkovsky", pos:["LW"], off:78, def:72, phys:80, fo:40, clu:78 },
      { name:"Kirby Dach", pos:["C"], off:72, def:74, phys:72, fo:80, clu:76 },
      { name:"Brendan Gallagher", pos:["RW"], off:66, def:74, phys:84, fo:40, clu:82 },
      { name:"Jake Evans", pos:["C"], off:58, def:84, phys:66, fo:82, clu:76 },
      { name:"Lane Hutson", pos:["D"], off:84, def:74, phys:54, fo:0, clu:78 },
      { name:"Mike Matheson", pos:["D"], off:74, def:78, phys:72, fo:0, clu:78 },
      { name:"Sam Montembeault", pos:["G"], off:0, def:84, phys:0, fo:0, clu:80 },
    ]},
    "Coyotes":    { colors:["#8C2633","#E2D6B5"], players:[
      { name:"Clayton Keller", pos:["C","RW"], off:86, def:70, phys:56, fo:74, clu:80 },
      { name:"Nick Schmaltz", pos:["C","RW"], off:80, def:68, phys:58, fo:72, clu:78 },
      { name:"Lawson Crouse", pos:["LW"], off:72, def:78, phys:84, fo:40, clu:80 },
      { name:"Barrett Hayton", pos:["C"], off:72, def:76, phys:68, fo:80, clu:76 },
      { name:"Matias Maccelli", pos:["LW","RW"], off:74, def:66, phys:54, fo:40, clu:74 },
      { name:"Jack McBain", pos:["C"], off:60, def:78, phys:80, fo:78, clu:74 },
      { name:"Mikhail Sergachev", pos:["D"], off:84, def:80, phys:78, fo:0, clu:82 },
      { name:"J.J. Moser", pos:["D"], off:68, def:78, phys:70, fo:0, clu:76 },
      { name:"Connor Ingram", pos:["G"], off:0, def:84, phys:0, fo:0, clu:78 },
    ]},
  },
};
const SPORTS = {
  NBA:  {
    label:"NBA",  sub:"All-time pros", data: TEAMS, noun:"lineup",
    intro:"Roll a random team-and-era combo, then draft ONE player from it to fill a spot in your five-man lineup (PG, SG, SF, PF, C). Repeat until your lineup is full. The goal: build an all-time roster strong enough to go a perfect 82-0 — a feat no real NBA team has ever achieved.",
    goal:82, half:41, rerolls:1,
    positions:["PG","SG","SF","PF","C"],
    cats:["pts","reb","ast","stl","blk"],
    catLabel:{ pts:"PTS", reb:"REB", ast:"AST", stl:"STL", blk:"BLK" },
    floors:{ pts:136, reb:52.6, ast:31.8, stl:3.2, blk:2.0 },
    perfectLabel:"🏆 PERFECT SEASON — 82-0! You beat that!",
    chase:"82-0", quest:"a perfect 82-0 season",
    tiers:[[70,"Elite contender"],[55,"Solid playoff team"],[0,"Work to do"]],
  },
  NCAA: {
    label:"NCAA", sub:"College careers", data: NCAA_TEAMS, noun:"starting five",
    intro:"Roll a random college team-and-era combo, then draft ONE player from it for your starting five (PG, SG, SF, PF, C), using their peak college stats. Repeat until full. The goal: a perfect 40-0 season — running the table all the way through the national championship, which only the 1976 Indiana Hoosiers have ever done.",
    goal:40, half:20, rerolls:1,
    positions:["PG","SG","SF","PF","C"],
    cats:["pts","reb","ast","stl","blk"],
    catLabel:{ pts:"PTS", reb:"REB", ast:"AST", stl:"STL", blk:"BLK" },
    floors:{ pts:116, reb:42.6, ast:17.7, stl:6.1, blk:6.2 },
    perfectLabel:"🏆 40-0 — PERFECT SEASON & NATIONAL TITLE! You beat that!",
    chase:"40-0", quest:"a perfect 40-0 national championship season",
    tiers:[[34,"Final Four lock"],[28,"Sweet Sixteen team"],[20,"Tournament bubble"],[0,"Long winter ahead"]],
    lossRounds:true,
  },
  NFL: {
    label:"NFL", sub:"Pro football", data: NFL_TEAMS, noun:"starting unit",
    intro:"Roll a random team-and-era combo, then draft ONE player from it to fill your starting unit — offense (QB, RB, WR, TE, OL), defense (front seven, defensive back), and a kicker. Players are rated on five team-impact categories, so you need a complete team, not just stars. The goal: a perfect 21-0 run through the Super Bowl.",
    goal:21, half:11, rerolls:2,
    positions:["QB","RB","WR","TE","OL","LB","CB","K"],
    slotPos:{ QB:["QB"], RB:["RB"], WR:["WR"], TE:["TE"], OL:["OL"], LB:["LB","DL","EDGE"], CB:["CB","S"], K:["K"] },
    slotNames:{ QB:"Quarterback", RB:"Running Back", WR:"Receiver", TE:"Tight End", OL:"Offensive Line", LB:"Front Seven", CB:"Defensive Back", K:"Kicker" },
    cats:["off","def","exp","prot","clu"],
    catLabel:{ off:"OFF", def:"DEF", exp:"EXP", prot:"PROT", clu:"CLU" },
    floors:{ off:398, def:270, exp:556, prot:373, clu:704 },
    perfectLabel:"🏆 21-0 — PERFECT SEASON & SUPER BOWL TITLE! You beat that!",
    chase:"21-0", quest:"a perfect 21-0 Super Bowl run",
    tiers:[[18,"Super Bowl favorite"],[14,"Deep playoff team"],[10,"Wild-card hopeful"],[0,"Rebuilding year"]],
    lossRounds:true,
  },
  NHL: {
    label:"NHL", sub:"Pro hockey", data: NHL_TEAMS, noun:"playoff roster",
    intro:"Roll a random team-and-era combo, then draft ONE player to build your roster: a top line (center, left wing, right wing), a two-way forward, two defensemen, and a goalie. Forwards are judged on offense, defense, physicality, and faceoffs. The goal: a perfect 16-0 sweep through all four playoff rounds to the Stanley Cup.",
    goal:16, half:8, rerolls:2,
    // Top line (C1 LW1 RW1) + one two-way forward (F2) + 2 D + 1 G
    positions:["C1","LW1","RW1","TWF","D1","D2","G"],
    slotPos:{ C1:["C"], LW1:["LW"], RW1:["RW"], TWF:["C","LW","RW"], D1:["D"], D2:["D"], G:["G"] },
    slotNames:{ C1:"Center", LW1:"Left Wing", RW1:"Right Wing", TWF:"Two-Way Forward", D1:"Defense", D2:"Defense", G:"Goalie" },
    slotBadge:{ C1:"C", LW1:"LW", RW1:"RW", TWF:"2WF", D1:"D", D2:"D", G:"G" },
    cats:["off","def","phys","fo","clu"],
    catLabel:{ off:"OFF", def:"DEF", phys:"PHYS", fo:"FO%", clu:"CLU" },
    floors:{ off:502, def:615, phys:467, fo:334, clu:618 },
    perfectLabel:"🏆 16-0 — PERFECT PLAYOFFS & STANLEY CUP! You beat that!",
    chase:"16-0", quest:"a perfect 16-0 run to the Stanley Cup",
    tiers:[[13,"Cup favorite"],[10,"Conference contender"],[6,"Playoff team"],[0,"Lottery-bound"]],
    lossRounds:true,
  },
};

const CATS = ["pts","reb","ast","stl","blk"];
const CAT_LABEL = { pts:"PTS", reb:"REB", ast:"AST", stl:"STL", blk:"BLK" };
const FLOORS = { pts:110, reb:48, ast:28, stl:7.5, blk:6.5 };
const POSITIONS = ["PG","SG","SF","PF","C"];

// Rough overall impact score. Used ONLY to pick the "star" for commentary —
// never shown to the player and no longer used to rank the draft list.
// Works for both stat shapes (basketball pts/reb/... and football off/def/...).
function playerScore(p) {
  if (p.pts !== undefined) return p.pts*1.0 + p.reb*1.2 + p.ast*1.5 + p.stl*3 + p.blk*3;
  return (p.off||0) + (p.def||0) + (p.exp||0)*0.5 + (p.prot||0)*0.4 + (p.clu||0)*0.6;
}

function teamTotals(lineup, cfg) {
  const cats = cfg ? cfg.cats : CATS;
  const t = {}; cats.forEach(c => t[c]=0);
  Object.values(lineup).forEach(p => { if (p) cats.forEach(c => t[c]+=(p[c]||0)); });
  return t;
}
function projectRecord(lineup, cfg) {
  const cats = cfg.cats, floors = cfg.floors, goal = cfg.goal, half = cfg.half;
  const curveK = cfg.curveK || 6;
  const totals = teamTotals(lineup, cfg);
  let product = 1; const breakdown = {};
  let allClear = true; let belowCount = 0;
  cats.forEach(c => {
    const ratio = totals[c]/floors[c];
    breakdown[c] = { total:+totals[c].toFixed(1), floor:floors[c], ratio:+ratio.toFixed(2) };
    product *= Math.min(1, Math.max(0, Math.min(1.10, ratio)));
    if (totals[c] < floors[c]) { allClear = false; belowCount++; }
  });
  const strength = Math.pow(product, 1/cats.length);
  let wins;
  if (allClear) {
    // Every floor cleared — the only path to a perfect record.
    wins = goal;
  } else {
    // Missed at least one floor: cannot go perfect. A steep curve makes near-perfect
    // records (e.g. 81-1) genuinely rare — only the very strongest imperfect teams
    // get close to the goal.
    const curved = Math.pow(strength, curveK);
    wins = Math.round(half + curved*half);
    const maxWinsIfImperfect = goal - belowCount; // lose >=1 per category under floor
    wins = Math.min(wins, maxWinsIfImperfect, goal - 1);
  }
  wins = Math.max(Math.round(goal*0.1), Math.min(goal, wins));
  return { wins, losses:goal-wins, totals, breakdown, strength, allClear, belowCount };
}
// Map a category's hidden ratio (total/floor) to a qualitative tier — no numbers shown.
// This is the only feedback the player sees per category: a word + a color.
function catTier(ratio) {
  if (ratio >= 1.15) return { label:"Elite",  color:"#FFCB45", glow:true,  cleared:true };
  if (ratio >= 1.0)  return { label:"Strong", color:"#34e89e", glow:true,  cleared:true };
  if (ratio >= 0.92) return { label:"Solid",  color:"#8fd6a8", glow:false, cleared:false }; // just short
  if (ratio >= 0.80) return { label:"Shaky",  color:"#ffb347", glow:false, cleared:false };
  return                    { label:"Weak",   color:"#ff5f6d", glow:false, cleared:false };
}
function headToHead(a, b, cfg) {
  const cats = cfg.cats;
  const ta = teamTotals(a, cfg), tb = teamTotals(b, cfg);
  let aWins=0, bWins=0;
  const rows = cats.map(c => {
    const winner = ta[c]>tb[c]?"A":tb[c]>ta[c]?"B":"T";
    if (winner==="A") aWins++; if (winner==="B") bWins++;
    return { cat:c, a:+ta[c].toFixed(1), b:+tb[c].toFixed(1), winner };
  });
  return { rows, aWins, bWins, winner: aWins>bWins?"A":bWins>aWins?"B":"T" };
}
// ── GUESS THE LINEUP (daily knowledge puzzle) ────────────────────────────────
// Each entry is ONE real, well-documented starting five. The "answer" for each
// slot is the player; alts allow common name variants for matching. Clues reveal
// progressively. NOTE: these are from memory and flagged for source verification
// before any public release — accuracy matters far more here than in the sim.
const LINEUP_PUZZLES = [
  {
    id:"bulls-96", title:"1996 NBA Champions", hint:"72 wins. A dynasty at its peak.", verified:true,
    slots:[
      { pos:"PG", answer:"Ron Harper", clue:"Veteran two-way guard, former 20-ppg scorer turned role player" },
      { pos:"SG", answer:"Michael Jordan", clue:"League MVP and Finals MVP this season" },
      { pos:"SF", answer:"Scottie Pippen", clue:"All-NBA wing, the ultimate second star" },
      { pos:"PF", answer:"Dennis Rodman", clue:"Led the league in rebounding; famously colorful" },
      { pos:"C",  answer:"Luc Longley", clue:"Australian center anchoring the middle" },
    ],
  },
  {
    id:"lakers-87", title:"1987 'Showtime' Champions", hint:"Fast breaks and five titles in the decade.",
    slots:[
      { pos:"PG", answer:"Magic Johnson", clue:"League MVP this year; 6'9\" point guard" },
      { pos:"SG", answer:"Byron Scott", clue:"Sharp-shooting two guard" },
      { pos:"SF", answer:"James Worthy", clue:"\"Big Game James\"" },
      { pos:"PF", answer:"A.C. Green", clue:"Iron-man forward, ultra-durable" },
      { pos:"C",  answer:"Kareem Abdul-Jabbar", clue:"All-time leading scorer; the skyhook", alts:["Kareem"] },
    ],
  },
  {
    id:"celtics-86", title:"1986 Champions (often called the best ever)", hint:"Boston frontcourt for the ages.",
    slots:[
      { pos:"PG", answer:"Dennis Johnson", clue:"Defensive-minded floor general, Hall of Famer", alts:["DJ"] },
      { pos:"SG", answer:"Danny Ainge", clue:"Fiery guard, later an NBA executive" },
      { pos:"SF", answer:"Larry Bird", clue:"Three-time MVP; this was the middle one" },
      { pos:"PF", answer:"Kevin McHale", clue:"Low-post footwork maestro" },
      { pos:"C",  answer:"Robert Parish", clue:"\"The Chief\"" },
    ],
  },
  {
    id:"pistons-89", title:"1989 'Bad Boys' Champions", hint:"Defense and attitude in Detroit.",
    slots:[
      { pos:"PG", answer:"Isiah Thomas", clue:"Diminutive superstar floor general" },
      { pos:"SG", answer:"Joe Dumars", clue:"Quiet, elite two-way guard" },
      { pos:"SF", answer:"Mark Aguirre", clue:"Scoring forward acquired midseason" },
      { pos:"PF", answer:"Dennis Rodman", clue:"Defensive menace and rebounder (before Chicago)" },
      { pos:"C",  answer:"Bill Laimbeer", clue:"Physical, three-point-shooting center" },
    ],
  },
  {
    id:"rockets-94", title:"1994 Champions", hint:"Houston, behind a legendary big man.", verified:true,
    slots:[
      { pos:"PG", answer:"Kenny Smith", clue:"\"The Jet\"" },
      { pos:"SG", answer:"Vernon Maxwell", clue:"Streaky, fearless scoring guard" },
      { pos:"SF", answer:"Robert Horry", clue:"Future clutch \"Big Shot\" role player" },
      { pos:"PF", answer:"Otis Thorpe", clue:"Bruising, efficient power forward" },
      { pos:"C",  answer:"Hakeem Olajuwon", clue:"MVP, DPOY, and Finals MVP \u2014 \"The Dream\"", alts:["Hakeem"] },
    ],
  },
  {
    id:"warriors-17", title:"2017 Champions (the 'Hamptons Five')", hint:"A super-team death lineup.",
    slots:[
      { pos:"PG", answer:"Stephen Curry", clue:"Two-time MVP, revolutionized shooting", alts:["Steph Curry"] },
      { pos:"SG", answer:"Klay Thompson", clue:"Splash Brother, elite catch-and-shoot" },
      { pos:"SF", answer:"Kevin Durant", clue:"Finals MVP this year, joined the prior season" },
      { pos:"PF", answer:"Draymond Green", clue:"Defensive anchor and playmaking forward" },
      { pos:"C",  answer:"Andre Iguodala", clue:"Small-ball five; 2015 Finals MVP", alts:["Andre Iguodola"] },
    ],
  },
  {
    id:"heat-13", title:"2013 Champions", hint:"South Beach super-team, second straight title.",
    slots:[
      { pos:"PG", answer:"Mario Chalmers", clue:"Young point guard, ex-Kansas champion" },
      { pos:"SG", answer:"Dwyane Wade", clue:"Franchise icon, \"Flash\"" },
      { pos:"SF", answer:"LeBron James", clue:"Back-to-back MVP and Finals MVP" },
      { pos:"PF", answer:"Udonis Haslem", clue:"Undrafted hometown stalwart" },
      { pos:"C",  answer:"Chris Bosh", clue:"Stretch big, the third of the Big Three" },
    ],
  },
  {
    id:"spurs-14", title:"2014 Champions", hint:"Beautiful team basketball, sweet revenge.",
    slots:[
      { pos:"PG", answer:"Tony Parker", clue:"French speedster floor general" },
      { pos:"SG", answer:"Danny Green", clue:"3-and-D wing, Finals record for threes (2013)" },
      { pos:"SF", answer:"Kawhi Leonard", clue:"Finals MVP, emerging two-way star" },
      { pos:"PF", answer:"Tim Duncan", clue:"\"The Big Fundamental\"" },
      { pos:"C",  answer:"Tiago Splitter", clue:"Brazilian center" },
    ],
  },
  {
    id:"cavs-16", title:"2016 Champions (down 3-1)", hint:"A historic comeback for Ohio.",
    slots:[
      { pos:"PG", answer:"Kyrie Irving", clue:"Hit the title-clinching dagger three" },
      { pos:"SG", answer:"J.R. Smith", clue:"Volatile, big-shot-making guard" },
      { pos:"SF", answer:"LeBron James", clue:"Finals MVP; \"The Block\"" },
      { pos:"PF", answer:"Kevin Love", clue:"Stretch four, ex-Timberwolf" },
      { pos:"C",  answer:"Tristan Thompson", clue:"Relentless offensive rebounder" },
    ],
  },
  {
    id:"lakers-00", title:"2000 Champions", hint:"Start of a three-peat in L.A.", verified:true,
    slots:[
      { pos:"PG", answer:"Derek Fisher", clue:"Steady, clutch guard; future union president", alts:["Ron Harper"] },
      { pos:"SG", answer:"Kobe Bryant", clue:"Rising superstar, would win five rings" },
      { pos:"SF", answer:"Glen Rice", clue:"Elite shooter, one season as the three" },
      { pos:"PF", answer:"A.C. Green", clue:"Veteran iron-man forward" },
      { pos:"C",  answer:"Shaquille O'Neal", clue:"MVP and Finals MVP \u2014 most dominant force in the game", alts:["Shaq","Shaquille O Neal"] },
    ],
  },
];

// Build a name pool for the Guess-the-Lineup typeahead: every unique NBA player
// name in the database, plus all puzzle answers (so answers are always findable).
const NBA_NAME_POOL = (() => {
  const set = new Set();
  try {
    Object.values(TEAMS).forEach(era => Object.values(era).forEach(team => team.players.forEach(p => set.add(p.name))));
  } catch {}
  LINEUP_PUZZLES.forEach(pz => pz.slots.forEach(s => set.add(s.answer)));
  return Array.from(set).sort();
})();

function dailyPuzzle() {
  // Only serve source-verified lineups (so testers never hit an unconfirmed one).
  // As you verify more, set verified:true on them and they'll join the rotation.
  const pool = LINEUP_PUZZLES.filter(p => p.verified);
  const list = pool.length ? pool : LINEUP_PUZZLES;
  return list[ (typeof dayNumber==="function"?dayNumber():0) % list.length ];
}

// Normalize a name for forgiving matching (case, punctuation, accents, spacing).
function normName(s) {
  return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[.'\-]/g," ").replace(/\s+/g," ").trim();
}

function rollTeamEra(data) {
  const eras = Object.keys(data);
  const era = eras[Math.floor(Math.random()*eras.length)];
  const teams = Object.keys(data[era]);
  const team = teams[Math.floor(Math.random()*teams.length)];
  return { era, team };
}

// ── SEEDED RNG (for daily challenge + shareable head-to-head boards) ──
// Mulberry32 — small, fast, deterministic. Same seed → same sequence everywhere.
function mulberry32(a) {
  return function() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(str) {
  let h = 2166136261;
  for (let i=0;i<str.length;i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
// Day number since epoch (UTC) → everyone worldwide gets the same daily board.
function dayNumber() { return Math.floor(Date.now() / 86400000); }
function dailySeed(sport) { return hashStr(`beatthat:${sport}:${dayNumber()}`); }
// Can this roster fill all slots using ONE position per player (distinct players)?
// Used to keep the Daily Challenge (single-position experts mode) always completable.
function singlePosFillable(roster, slotNeeds) {
  const used = new Set();
  function bt(k) {
    if (k === slotNeeds.length) return true;
    const accepts = slotNeeds[k];
    for (let i=0;i<roster.length;i++) {
      if (used.has(i)) continue;
      if (roster[i].pos.some(p => accepts.includes(p))) {
        used.add(i);
        if (bt(k+1)) return true;
        used.delete(i);
      }
    }
    return false;
  }
  return bt(0);
}

// Roll a team/era from a seeded RNG (returns next roll + advances the rng).
function seededRoll(data, rng, slotNeeds) {
  const eras = Object.keys(data);
  for (let attempt=0; attempt<40; attempt++) {
    const era = eras[Math.floor(rng()*eras.length)];
    const teams = Object.keys(data[era]);
    const team = teams[Math.floor(rng()*teams.length)];
    // In daily mode we pass slotNeeds and require single-position fillability.
    if (!slotNeeds || singlePosFillable(data[era][team].players, slotNeeds)) {
      return { era, team };
    }
  }
  // fallback: any team
  const era = eras[Math.floor(rng()*eras.length)];
  const teams = Object.keys(data[era]);
  return { era, team: teams[Math.floor(rng()*teams.length)] };
}
// Short shareable code <-> seed
function seedToCode(seed) { return (seed >>> 0).toString(36).toUpperCase(); }
// Short, human-readable board identifier — BOTH players on the same board derive the
// same tag from the same seed, so scores posted in a chat are provably the same duel.
function boardTag(seed) {
  const s = (seed >>> 0).toString(36).toUpperCase().replace(/[^A-Z0-9]/g,"");
  // Take the last 4 real characters; pad on the LEFT only if shorter than 4.
  return s.length >= 4 ? s.slice(-4) : s.padStart(4, "0");
}
function codeToSeed(code) { return parseInt(code, 36) >>> 0; }

// ── CHALLENGE LINKS ──────────────────────────────────────────────────────────
// A challenge packs everything a friend needs into one compact code:
//   sport · type (S=same board, W=wild/unique) · seed · sender wins-losses · name
// Encoded as URL-safe parts joined by "-". Travels as a link (?c=...) or typed code.
const SPORT_CODES = { NBA:"N", NCAA:"C", NFL:"F", NHL:"H" };
const CODE_SPORTS = { N:"NBA", C:"NCAA", F:"NFL", H:"NHL" };
function encodeChallenge({ sport, type, seed, wins, losses, name }) {
  const parts = [
    SPORT_CODES[sport] || "N",
    type === "wild" ? "W" : "S",
    (seed >>> 0).toString(36),
    (wins||0).toString(36),
    (losses||0).toString(36),
  ];
  let code = parts.join("-").toUpperCase();
  if (name) code += "~" + encodeURIComponent(name);
  return code;
}
function decodeChallenge(raw) {
  try {
    if (!raw) return null;
    let name = "";
    let code = raw.trim();
    const tilde = code.indexOf("~");
    if (tilde >= 0) { name = decodeURIComponent(code.slice(tilde+1)); code = code.slice(0, tilde); }
    const p = code.toUpperCase().split("-");
    if (p.length < 5) return null;
    const sport = CODE_SPORTS[p[0]] || "NBA";
    const type = p[1] === "W" ? "wild" : "same";
    const seed = parseInt(p[2], 36) >>> 0;
    const wins = parseInt(p[3], 36) || 0;
    const losses = parseInt(p[4], 36) || 0;
    if (isNaN(seed)) return null;
    return { sport, type, seed, wins, losses, name };
  } catch { return null; }
}
// Build the full shareable URL (falls back to just the code if no origin).
function challengeUrl(code) {
  try {
    const base = window.location.origin + window.location.pathname;
    return `${base}?c=${encodeURIComponent(code)}`;
  } catch { return code; }
}

// ── COMMENTARY ───────────────────────────────────────────────────────────────
// All pools are namespaced by sport so vocabulary never leaks across leagues.
const HOOPS_NOUN = { pts:"scoring", reb:"rebounding", ast:"playmaking", stl:"perimeter defense", blk:"rim protection" };
const FB_NOUN    = { off:"offense", def:"defense", exp:"explosiveness", prot:"trench play", clu:"clutch execution" };
const HK_NOUN    = { off:"offense", def:"defensive play", phys:"physicality", fo:"faceoffs and puck battles", clu:"clutch play" };
const CAT_NOUN_BY = { NBA:HOOPS_NOUN, NCAA:HOOPS_NOUN, NFL:FB_NOUN, NHL:HK_NOUN };

const HOOPS_FIX = {
  pts:["another bucket-getter","a go-to scorer for crunch time","a flamethrower off the bench","a second option who can create his own shot"],
  reb:["a real rebounder to clean the glass","a glass-eater who owns the paint","a relentless board-crasher","someone to win the rebounding battle"],
  ast:["a true floor general to set the table","a pass-first maestro","a primary ball-handler to run the offense","a playmaker who makes everyone better"],
  stl:["a pesky on-ball defender","a ball-hawk to jump passing lanes","a perimeter stopper","a disruptor who forces turnovers"],
  blk:["a shot-blocking anchor inside","a rim protector to wall off the paint","an eraser at the basket","a defensive backbone in the middle"],
};
const FB_FIX = {
  off:["a true No. 1 weapon","a difference-maker on offense","another playmaker to move the chains","a game-breaker in the passing game"],
  def:["a defensive cornerstone","a shutdown presence on that side","an impact defender who changes games","a leader for the front seven"],
  exp:["a true home-run threat","a speed merchant who flips field position","a big-play burner","an explosive playmaker in space"],
  prot:["a road-grader up front","an anchor for the offensive line","a trench-warrior to win the line of scrimmage","a maul-you blocker"],
  clu:["a proven closer","a cold-blooded clutch performer","a steady hand for January football","a player who shows up when it matters most"],
};
const HK_FIX = {
  off:["a pure finisher up top","a dynamic scoring winger","a play-driving forward who tilts the ice","a top-line threat who buries his chances"],
  def:["a shutdown defenseman","a reliable two-way presence","a stay-at-home blueliner who defends the slot","a goaltender who steals games"],
  phys:["a punishing forechecker","a power forward to win the puck battles","a heavy two-way presence","a grinder who sets the tone on the forecheck"],
  fo:["a faceoff specialist","a center who owns the dot","a two-way pivot to win key draws","a reliable presence on every faceoff"],
  clu:["a proven playoff performer","a cold-blooded clutch scorer","a veteran who rises in Game 7s","a player who shows up when the lights are brightest"],
};
const CAT_FIX_BY = { NBA:HOOPS_FIX, NCAA:HOOPS_FIX, NFL:FB_FIX, NHL:HK_FIX };

function lastName(n) { return n.split(" ").slice(-1)[0]; }
function lineupArr(lineup, cfg) { return (cfg?cfg.positions:POSITIONS).map(p => lineup[p]).filter(Boolean); }
// Deterministic-but-distinct seed from the actual players on the roster
function lineupSeed(lineup) {
  const str = Object.values(lineup).filter(Boolean).map(p=>p.name+p.era).join("|");
  let h = 0;
  for (let i=0;i<str.length;i++) { h = (h*31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}
function pickN(arr, seed) { return arr[seed % arr.length]; }

// Identity pools, namespaced by sport
const HOOPS_IDENTITY = {
  pts:[
    "an offensive juggernaut that scores from all three levels",
    "a firepower-loaded outfit built to win track meets",
    "a bucket-getting machine that turns any night into a shootout",
    "a relentless scoring unit that never stops attacking",
    "a points-in-bunches group that can erase any deficit",
    "an offensive show that lights up the scoreboard",
  ],
  reb:[
    "a bruising team that flat-out owns the glass",
    "a rebounding wall that ends possessions with one shot",
    "a physical, paint-pounding group nobody wants to box out",
    "a board-dominating squad that wins the hustle war",
    "a glass-cleaning crew that turns misses into second chances",
  ],
  ast:[
    "a gorgeous, unselfish passing team",
    "a pass-happy unit that carves defenses into ribbons",
    "a read-and-react offense where the ball never sticks",
    "a symphony of ball movement and cutting",
    "a high-IQ group that always finds the open man",
  ],
  stl:[
    "a swarming, ball-hawking nightmare on defense",
    "a disruptive bunch that turns steals into easy baskets",
    "a passing-lane-jumping menace in the backcourt",
    "a pressure defense that suffocates ball-handlers",
    "a havoc-creating group that lives in transition",
  ],
  blk:[
    "a fortress at the rim",
    "a shot-erasing monster in the paint",
    "a defensive anchor that makes drivers think twice",
    "an interior wall that turns the paint into a no-fly zone",
    "a rim-protecting unit that funnels everything into traffic",
  ],
};
const FB_IDENTITY = {
  off:[
    "an offensive machine that moves the ball at will",
    "a high-octane attack that puts up points in a hurry",
    "a balanced offense defenses simply can't key on",
    "a unit that controls the game by controlling the ball",
    "a relentless scoring offense built for January",
  ],
  def:[
    "a smothering defense that travels",
    "a bend-but-don't-break unit that wins in the trenches",
    "a takeaway-hungry defense that flips field position",
    "a championship-caliber defense with no soft spot",
    "a unit that makes life miserable for any quarterback",
  ],
  exp:[
    "a big-play offense that can score from anywhere",
    "a lightning-quick unit that turns a crease into six",
    "an explosive, field-tilting group of weapons",
    "a track team in pads that stretches the field",
    "a home-run-hitting offense that strikes in an instant",
  ],
  prot:[
    "a trench-dominating team that wins up front",
    "a maul-you outfit that controls the line of scrimmage",
    "a physical group that imposes its will in the run game",
    "an offense protected by a wall of blockers",
    "a smash-mouth team that grinds opponents down",
  ],
  clu:[
    "a battle-tested team built for the biggest moments",
    "an ice-in-the-veins group that thrives under pressure",
    "a steady, veteran outfit that doesn't blink late",
    "a team that finds a way to win the close ones",
    "a poised contender made for playoff football",
  ],
};
const HK_IDENTITY = {
  off:[
    "a high-flying team that buries its chances",
    "an offensive powerhouse that can light the lamp in bunches",
    "a skilled, play-driving group that tilts the ice",
    "a relentless attack that generates wave after wave of chances",
    "a dangerous scoring team that strikes from everywhere",
  ],
  def:[
    "a stingy defensive team that strangles the neutral zone",
    "a shot-suppressing group that defends the slot ferociously",
    "a structurally sound team backstopped by a brick wall in net",
    "a defensively responsible roster with no easy chances against",
    "a checking-tight team that makes every inch miserable",
  ],
  phys:[
    "a heavy, punishing team that wears opponents down",
    "a forechecking machine that never gives the puck a moment's peace",
    "a bruising group that owns the boards and the front of the net",
    "a hard-nosed team built for playoff hockey",
    "a physical wrecking crew that dictates the tempo",
  ],
  fo:[
    "a faceoff-dominant team that controls possession",
    "a group that wins the dot and plays with the puck",
    "a center-strong roster that starts every shift on the attack",
    "a puck-possession team that strangles the game",
    "a draw-winning unit that tilts the ice its way",
  ],
  clu:[
    "a battle-tested team built for deep playoff runs",
    "an ice-in-the-veins group that thrives in overtime",
    "a poised, veteran roster that doesn't crack in Game 7s",
    "a team that finds a way to win the tight ones",
    "a clutch group made for spring hockey",
  ],
};
const IDENTITY_BY = { NBA:HOOPS_IDENTITY, NCAA:HOOPS_IDENTITY, NFL:FB_IDENTITY, NHL:HK_IDENTITY };
const OPENERS = ["This is ","You've built ","What you've got here is ","Make no mistake — this is ","On paper this is ","Quite simply, "];
function synergyNote(arr, star, eras, seed, cfg) {
  const lg = cfg ? cfg.label : "NBA";
  const unit = lg==="NFL" ? "roster" : lg==="NHL" ? "lineup" : lg==="NCAA" ? "starting five" : "starting five";
  const bench = lg==="NFL" ? "sideline" : "bench";
  // sport-specific "make every X a problem"
  const beat = lg==="NFL" ? "make every snap a problem"
            : lg==="NHL" ? "make every shift a nightmare to play against"
            : "make every possession a problem";
  const playTogether = lg==="NHL" ? "like linemates who've skated together for years" : "like they've played together for years";
  const notes = [
    `With ${star.name} setting the tone, the pieces fit ${playTogether}.`,
    `${lastName(star.name)} is the engine, and everyone else knows how to play off him.`,
    `It's the kind of team that would terrify a coach on the other ${bench}.`,
    `Put this group together and chemistry is the least of your worries.`,
    `${eras.length>=4?"Different eras, one identity":"Clear roles, no weak links"} — that's how you chase history.`,
    `There isn't a weak link in this ${unit}, and ${lastName(star.name)} ties it all together.`,
    `They'd impose their will and ${beat}.`,
    `Balanced, battle-tested, and built around ${lastName(star.name)} — a tough out for anybody.`,
  ];
  return pickN(notes, seed);
}

function praiseLine(lineup, cfg) {
  const floors = cfg ? cfg.floors : FLOORS;
  const cats = cfg ? cfg.cats : CATS;
  const lg = cfg ? cfg.label : "NBA";
  const IDENTITY = IDENTITY_BY[lg] || HOOPS_IDENTITY;
  const arr = lineupArr(lineup, cfg);
  if (!arr.length) return "";
  const totals = teamTotals(lineup, cfg);
  const star = [...arr].sort((a,b)=>playerScore(b)-playerScore(a))[0];
  let bestCat = cats[0], bestRatio = 0;
  cats.forEach(c => { const r = totals[c]/floors[c]; if (r>bestRatio){ bestRatio=r; bestCat=c; } });
  const eras = [...new Set(arr.map(p=>p.era))];
  const seed = lineupSeed(lineup);
  const opener = pickN(OPENERS, seed >> 2);
  const identity = pickN(IDENTITY[bestCat] || IDENTITY[cats[0]], seed >> 5);
  const synergy = synergyNote(arr, star, eras, seed >> 8, cfg);
  const starConnect = pickN([
    `, with ${star.name} leading the way`,
    `, and ${star.name} is the headliner`,
    ` — ${star.name} is the centerpiece`,
    `, built around ${star.name}`,
    `, with ${star.name} out front`,
    ` that runs through ${star.name}`,
  ], seed >> 11);
  return `${opener}${identity}${starConnect}. ${synergy}`;
}

// Explain WHERE a non-perfect run ended. NCAA = tournament rounds; NFL = playoff rounds.
function lossLocationLine(wins, cfg, seed) {
  if (!cfg.lossRounds || wins >= cfg.goal) return "";
  if (cfg.label === "NCAA") {
    const ROUNDS = [
      [39, "the National Championship game", "so close — one win from immortality"],
      [38, "the Final Four", "a national semifinal heartbreaker"],
      [37, "the Elite Eight", "stopped one step short of the Final Four"],
      [36, "the Sweet Sixteen", "a second-weekend exit"],
      [35, "the Round of 32", "an early-tournament stumble"],
      [34, "the Round of 64", "a first-round upset — the bracket-buster nobody wants to be"],
    ];
    const hit = ROUNDS.find(([w])=>wins===w);
    if (hit) return `They ran the table all year and into March, but fell in ${hit[1]} — ${hit[2]}.`;
    const losses = cfg.goal - wins;
    return pickN([
      `The perfect run ended in the regular season — ${losses} loss${losses>1?"es":""} before the bracket even arrived.`,
      `This team didn't make it to March unbeaten; the slip came during the regular season.`,
      `A regular-season loss (or ${losses}) ended the 40-0 dream long before Selection Sunday.`,
    ], seed);
  }
  if (cfg.label === "NFL") {
    // 21-0 = 17 regular-season wins + 4 playoff wins. Last 4 wins are the playoff rounds.
    const ROUNDS = [
      [20, "the Super Bowl", "one win from a perfect season — agonizing"],
      [19, "the Conference Championship", "a title-game heartbreaker one step from the Super Bowl"],
      [18, "the Divisional Round", "a second-weekend playoff exit"],
      [17, "the Wild Card Round", "a stunning first-round upset after a perfect regular season"],
    ];
    const hit = ROUNDS.find(([w])=>wins===w);
    if (hit) return `They went a perfect 17-0 in the regular season but fell in ${hit[1]} — ${hit[2]}.`;
    const losses = cfg.goal - wins;
    return pickN([
      `The perfect run ended in the regular season — ${losses} loss${losses>1?"es":""} before January even arrived.`,
      `This team never made the playoffs unbeaten; the slip came during the regular season.`,
      `A regular-season loss (or ${losses}) ended the 21-0 dream before the bright lights of the postseason.`,
    ], seed);
  }
  if (cfg.label === "NHL") {
    // 16-0 = sweep all 4 playoff rounds (4 wins each).
    const ROUNDS = [
      [15, "Game 7 of the Stanley Cup Final", "one win from lifting the Cup — utter heartbreak"],
      [14, "the Stanley Cup Final", "fell at the final hurdle with the Cup in sight"],
      [12, "the Conference Final", "a third-round exit, two rounds from glory"],
      [8, "the Second Round", "couldn't get past the second round"],
      [4, "the First Round", "a stunning first-round upset"],
    ];
    // map by which round the run died: 16 wins=Cup; 12-15 final; 8-11 conf final; 4-7 R2; 0-3 R1
    let hit;
    if (wins>=12) hit = wins===15?ROUNDS[0]:ROUNDS[1];
    else if (wins>=8) hit = ROUNDS[2];
    else if (wins>=4) hit = ROUNDS[3];
    else hit = ROUNDS[4];
    return `They stormed through the bracket but fell in ${hit[1]} — ${hit[2]}.`;
  }
  return "";
}

function seasonGapLine(lineup, cfg) {
  const cats = cfg.cats;
  const NOUN = CAT_NOUN_BY[cfg.label] || HOOPS_NOUN;
  const FIX = CAT_FIX_BY[cfg.label] || HOOPS_FIX;
  const r = projectRecord(lineup, cfg);
  const chase = cfg.chase;
  const seed = lineupSeed(lineup);
  const below = cats.filter(c => r.breakdown[c].total < r.breakdown[c].floor)
                    .sort((a,b)=> r.breakdown[a].ratio - r.breakdown[b].ratio);
  if (!below.length) {
    return pickN([
      `Honestly? Nothing. This roster has everything it needs for ${chase}.`,
      "No real holes here — this team is built to run the table.",
      "It clears every bar. This is a legitimate undefeated threat.",
      "Nothing's missing. This is a complete team.",
    ], seed);
  }
  const fix = pickN(FIX[below[0]], seed >> 3);
  if (below.length === 1) {
    return pickN([
      `One gap: the ${NOUN[below[0]]} runs short — find ${fix}.`,
      `To go perfect it needs ${fix}; the ${NOUN[below[0]]} is the soft spot.`,
      `The only thing standing between this team and history is ${fix}.`,
    ], seed >> 6);
  }
  return pickN([
    `The holes are ${NOUN[below[0]]} and ${NOUN[below[1]]} — start by adding ${fix}.`,
    `Two soft spots: ${NOUN[below[0]]} and ${NOUN[below[1]]}. Get ${fix} and it tightens up fast.`,
  ], seed >> 6);
}

function h2hAnalysisLine(myLineup, oppLineup, label, cfg) {
  const cats = cfg.cats, floors = cfg.floors;
  const NOUN = CAT_NOUN_BY[cfg.label] || HOOPS_NOUN;
  const me = teamTotals(myLineup, cfg), opp = teamTotals(oppLineup, cfg);
  const seed = lineupSeed(myLineup) ^ lineupSeed(oppLineup);
  const wins = cats.filter(c => me[c] > opp[c]).sort((a,b)=> (me[b]-opp[b])/floors[b] - (me[a]-opp[a])/floors[a]);
  const losses = cats.filter(c => opp[c] > me[c]).sort((a,b)=> (opp[b]-me[b])/floors[b] - (opp[a]-me[a])/floors[a]);
  const oppStar = [...lineupArr(oppLineup, cfg)].sort((a,b)=>playerScore(b)-playerScore(a))[0];
  if (!losses.length) {
    return pickN([
      `${label} wins this matchup going away — they're better in every category, and ${lastName(oppStar.name)} can't cover all the gaps alone.`,
      `It's a mismatch: ${label} controls every phase, leaving ${lastName(oppStar.name)} on an island.`,
      `${label} simply has too much across the board; ${lastName(oppStar.name)} gets no help here.`,
    ], seed);
  }
  const edge = wins.length
    ? pickN([`${label} owns the ${NOUN[wins[0]]} battle`, `${label}'s edge is clear in ${NOUN[wins[0]]}`, `${label} wins the ${NOUN[wins[0]]} matchup easily`], seed >> 2)
    : `${label} is climbing uphill in this one`;
  const hole = losses[0];
  const exploit = pickN([
    `${lastName(oppStar.name)} and company punish them on ${NOUN[hole]}`,
    `they get torched on ${NOUN[hole]}, with ${lastName(oppStar.name)} leading the charge`,
    `the ${NOUN[hole]} gap is where ${lastName(oppStar.name)} makes them pay`,
  ], seed >> 5);
  const closer = pickN(["Fix that and the game flips.", "Close that gap and it's anyone's game.", "Solve it and they take over.", "Shore that up and the edge swings back."], seed >> 7);
  return `${edge}, but ${exploit}. ${closer}`;
}

const C = {
  bg:"#070710", card:"rgba(28,28,44,0.55)", cardSolid:"#15151f",
  border:"rgba(255,255,255,0.08)", borderBright:"rgba(255,255,255,0.16)",
  gold:"#FFCB45", green:"#34e89e", red:"#ff5f6d", blue:"#5b9dff",
  text:"#f6f6fb", muted:"#9a9ab0", dim:"#62627a",
};

const s = {
  app:{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Inter','Helvetica Neue',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden" },
  // ambient color glow behind everything for depth
  glow:{ position:"fixed", top:"-20%", left:"50%", transform:"translateX(-50%)", width:"140%", height:"55%", background:"radial-gradient(ellipse at center, rgba(91,157,255,0.10), transparent 70%)", pointerEvents:"none", zIndex:0 },
  hdr:{ width:"100%", padding:"16px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:2, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", background:"rgba(7,7,16,0.6)" },
  logo:{ fontSize:20, fontWeight:900, letterSpacing:"-0.5px", fontStyle:"italic", textTransform:"uppercase", fontFamily:"'Archivo','Inter',sans-serif" },
  wrap:{ width:"100%", maxWidth:560, padding:"18px 16px 40px", position:"relative", zIndex:1 },
  // frosted glass card
  card:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:18, marginBottom:14, backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", boxShadow:"0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)" },
  // tactile primary button with depth
  btn:(bg=C.gold,fg="#0a0a0f")=>({ padding:"16px 18px", background:bg, color:fg, border:"none", borderRadius:16, fontWeight:800, fontSize:16, cursor:"pointer", width:"100%", marginTop:8, boxShadow:`0 6px 20px ${typeof bg==="string"&&bg.startsWith("#")?bg+"55":"rgba(0,0,0,0.4)"}, inset 0 1px 0 rgba(255,255,255,0.25)`, transition:"transform 0.08s ease, box-shadow 0.2s ease", letterSpacing:0.2 }),
  ghost:{ padding:"13px 14px", background:"rgba(255,255,255,0.04)", color:C.muted, border:`1px solid ${C.border}`, borderRadius:14, fontWeight:600, fontSize:13, cursor:"pointer", width:"100%", marginTop:10 },
  eyebrow:{ fontSize:11, color:C.muted, fontWeight:800, letterSpacing:1.5, marginBottom:12, textTransform:"uppercase" },
  row:{ display:"flex", justifyContent:"space-between", alignItems:"center" },
};

// Inline horizontal stats: high-contrast white numbers, readable labels
// ── GUESS THE LINEUP — daily knowledge puzzle (its own section) ──────────────
function PuzzleGame({ puzzle, accent, onExit, puzzleStats, recordPuzzle, showToast }) {
  const TRIES_PER_SLOT = 3;
  const [solved, setSolved] = useState(() => puzzle.slots.map(()=>false));
  const [missed, setMissed] = useState(() => puzzle.slots.map(()=>false)); // gave up / ran out on this slot
  const [revealed, setRevealed] = useState(() => puzzle.slots.map(()=>0)); // clue level per slot
  const [activeSlot, setActiveSlot] = useState(0);
  const [query, setQuery] = useState("");
  const [guessLog, setGuessLog] = useState(() => puzzle.slots.map(()=>[])); // wrong guesses per slot
  const [recorded, setRecorded] = useState(false);

  const resolved = solved.map((sv,i)=> sv || missed[i]); // a slot is "done" if solved or missed
  const allSolved = solved.every(Boolean);
  const finished = resolved.every(Boolean);
  const totalMisses = guessLog.reduce((n,arr)=>n+arr.length,0);

  useEffect(() => {
    if (finished && !recorded) {
      setRecorded(true);
      recordPuzzle(puzzle.id, allSolved, totalMisses);
    }
    // eslint-disable-next-line
  }, [finished]);

  // move active to the next still-open slot
  function advance(resArr) {
    const next = resArr.findIndex(v=>!v);
    if (next >= 0) setActiveSlot(next);
  }

  // typeahead suggestions — match on normalized name AND a space-stripped version,
  // so "oneal" finds "O'Neal" and "abduljabbar" finds "Abdul-Jabbar".
  const suggestions = (() => {
    const q = normName(query);
    if (!q || q.length < 2) return [];
    const qTight = q.replace(/\s/g,"");
    return NBA_NAME_POOL.filter(n => {
      const nn = normName(n);
      return nn.includes(q) || nn.replace(/\s/g,"").includes(qTight);
    }).slice(0, 6);
  })();

  function matchesAnswer(slot, name) {
    const cand = normName(name);
    if (cand === normName(slot.answer)) return true;
    return (slot.alts||[]).some(a => normName(a) === cand);
  }

  function guess(name) {
    if (finished) return;
    const i = activeSlot;
    const slot = puzzle.slots[i];
    setQuery("");
    if (solved[i] || missed[i]) return;
    if (matchesAnswer(slot, name)) {
      const ns = [...solved]; ns[i] = true; setSolved(ns);
      advance(ns.map((v,j)=>v||missed[j]));
    } else {
      const gl = guessLog.map((arr,j)=> j===i ? [...arr, name] : arr); setGuessLog(gl);
      const nr = [...revealed]; nr[i] = Math.min(3, nr[i]+1); setRevealed(nr);
      // out of tries on THIS slot → reveal its answer (counts as missed) and move on
      if (gl[i].length >= TRIES_PER_SLOT) {
        const nm = [...missed]; nm[i] = true; setMissed(nm);
        advance(solved.map((v,j)=>v||nm[j]));
      }
    }
  }

  // let the player give up on the current slot (reveals the answer, keeps the game moving)
  function revealSlot() {
    if (finished) return;
    const i = activeSlot; if (solved[i] || missed[i]) return;
    const nm = [...missed]; nm[i] = true; setMissed(nm);
    advance(solved.map((v,j)=>v||nm[j]));
  }

  function shareGrid() {
    const day = (typeof dayNumber==="function"?dayNumber():0)%100000;
    const squares = puzzle.slots.map((s,i)=> solved[i] ? (guessLog[i].length===0 ? "🟩" : "🟨") : "🟥").join("");
    const text = [
      `Beat That · Guess the Lineup #${day}`,
      puzzle.title,
      squares,
      allSolved ? `Named all 5 with ${totalMisses} miss${totalMisses===1?"":"es"}!` : `Got ${solved.filter(Boolean).length}/5.`,
      `Can you name them?`,
    ].join("\n");
    navigator.clipboard?.writeText(text).then(()=>showToast("Result copied — paste it anywhere"), ()=>showToast("Couldn't copy"));
  }

  return (
    <div style={s.app}>
      <div style={{ ...s.glow, background:`radial-gradient(ellipse at center, ${accent}22, transparent 70%)` }} />
      <div style={s.hdr}>
        <div style={{ ...s.logo, cursor:"pointer" }} onClick={onExit} title="Back to home">BEAT <span style={{ color:accent }}>THAT</span></div>
        <button onClick={onExit} style={{ background:"none", border:"none", color:C.muted, fontSize:20, cursor:"pointer" }}>✕</button>
      </div>
      <div style={s.wrap}>
        <div style={{ textAlign:"center", padding:"14px 0 18px" }}>
          <div style={{ ...s.eyebrow, color:accent, marginBottom:6 }}>🧠 Guess the Lineup · Daily</div>
          <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:26, fontWeight:900, letterSpacing:-0.5 }}>{puzzle.title}</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:6 }}>{puzzle.hint}</div>
          {!finished && (
            <div style={{ marginTop:12, display:"flex", justifyContent:"center", gap:6, alignItems:"center" }}>
              {puzzle.slots.map((_,i)=>(
                <span key={i} style={{ width:10, height:10, borderRadius:"50%", background: solved[i]?C.green : missed[i]?C.red : i===activeSlot?accent : "rgba(255,255,255,0.15)" }} />
              ))}
              <span style={{ fontSize:11, color:C.muted, marginLeft:6, fontWeight:700 }}>{solved.filter(Boolean).length}/5 named</span>
            </div>
          )}
        </div>

        {/* Slots */}
        <div style={s.card}>
          {puzzle.slots.map((slot,i) => {
            const isActive = i===activeSlot && !finished;
            const rev = (finished || missed[i]) ? 3 : revealed[i];
            const isDone = solved[i] || missed[i];
            const triesLeft = TRIES_PER_SLOT - guessLog[i].length;
            return (
              <div key={i} onClick={()=>{ if(!finished && !isDone) setActiveSlot(i); }}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", marginBottom:7, borderRadius:14,
                  background: solved[i] ? `${C.green}1f` : missed[i] ? `${C.red}1a` : isActive ? `${accent}1a` : "rgba(255,255,255,0.03)",
                  border:`1.5px solid ${solved[i]?C.green: missed[i]?C.red: isActive?accent:C.border}`, cursor: (!finished&&!isDone)?"pointer":"default" }}>
                <div style={{ width:42, height:32, borderRadius:9, background: solved[i]?C.green:missed[i]?C.red:accent, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, color:"#fff", flexShrink:0, fontFamily:"'Archivo',sans-serif" }}>{slot.pos}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  {isDone ? (
                    <div style={{ fontWeight:800, fontSize:15, color: solved[i]?C.text:C.red }}>
                      {slot.answer}{missed[i] ? "  (missed)" : ""}
                    </div>
                  ) : (
                    <div style={{ fontSize:13, color:C.muted }}>
                      {rev===0 && (isActive ? "Type a name below" : "Tap to guess this slot")}
                      {rev===1 && `Clue: a ${slot.pos}`}
                      {rev===2 && `Clue: ${slot.clue}`}
                      {rev>=3 && `Initials: ${slot.answer.split(" ").map(w=>w[0]).join(". ")}.`}
                    </div>
                  )}
                  {guessLog[i].length>0 && !isDone && (
                    <div style={{ fontSize:10.5, color:C.dim, marginTop:2 }}>✕ {guessLog[i].join(", ")} · {triesLeft} left</div>
                  )}
                </div>
                {solved[i] && <span style={{ color:C.green, fontWeight:900 }}>✓</span>}
                {missed[i] && <span style={{ color:C.red, fontWeight:900 }}>✕</span>}
              </div>
            );
          })}
        </div>

        {/* Typeahead input */}
        {!finished && (
          <div style={s.card}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:8, fontWeight:700 }}>Naming the <span style={{ color:accent }}>{puzzle.slots[activeSlot].pos}</span> — type and tap a player</div>
            <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Start typing a name…"
              style={{ width:"100%", padding:"13px 14px", borderRadius:12, border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.05)", color:C.text, fontSize:15, fontWeight:600, outline:"none" }} />
            {suggestions.length>0 && (
              <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:4 }}>
                {suggestions.map(name => (
                  <button key={name} className="bt-press" onClick={()=>guess(name)}
                    style={{ textAlign:"left", padding:"11px 13px", borderRadius:10, border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.04)", color:C.text, fontSize:14, fontWeight:700, cursor:"pointer" }}>{name}</button>
                ))}
              </div>
            )}
            {query.length>=2 && suggestions.length===0 && (
              <div style={{ fontSize:12, color:C.dim, marginTop:8 }}>No match — try a different spelling or another player.</div>
            )}
            <button className="bt-press" style={{ ...s.ghost, marginTop:10 }} onClick={revealSlot}>I don't know — reveal this player</button>
          </div>
        )}

        {/* Result */}
        {finished && (
          <div style={{ ...s.card, textAlign:"center", borderColor: allSolved?C.green:C.red }}>
            <div style={{ fontFamily:"'Archivo',sans-serif", fontSize:24, fontWeight:900, color: allSolved?C.green:C.red }}>
              {allSolved ? "Solved! 🎉" : `Got ${solved.filter(Boolean).length}/5`}
            </div>
            <div style={{ fontSize:13.5, color:C.muted, marginTop:6, lineHeight:1.5 }}>
              {allSolved ? `You named the ${puzzle.title} with ${totalMisses} miss${totalMisses===1?"":"es"}.` : `That was the ${puzzle.title}. The answers are above — come back tomorrow for a new one.`}
            </div>
            <div style={{ margin:"14px 0", fontFamily:"monospace", fontSize:22, letterSpacing:3 }}>
              {puzzle.slots.map((s2,i)=> solved[i] ? (guessLog[i].length===0?"🟩":"🟨") : "🟥").join("")}
            </div>
            <button className="bt-press" style={s.btn(accent,"#06120c")} onClick={shareGrid}>Share Result 📋</button>
            <button className="bt-press" style={s.ghost} onClick={onExit}>Back to menu</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatChips({ p, accent, cats, labels }) {
  const useCats = cats || CATS;
  const useLabels = labels || CAT_LABEL;
  // For football, a player is empty in the categories that don't apply (0) — show only nonzero
  const shown = useCats.filter(c => (p[c]||0) > 0);
  const list = shown.length ? shown : useCats;
  return (
    <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
      {list.map(c => (
        <div key={c} style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:30 }}>
          <span style={{ fontSize:15, fontWeight:900, color:"#ffffff", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{p[c]}</span>
          <span style={{ fontSize:8.5, color:"#b8b8c8", fontWeight:700, letterSpacing:0.4, marginTop:2 }}>{useLabels[c]}</span>
        </div>
      ))}
    </div>
  );
}

// Draw the shareable result card onto a canvas (always works in-artifact; no html2canvas).
function drawShareCard(canvas, { cfg, r, perfect, teamName, lineupA, accent, seedInfo, full }) {
  const W = 1080, H = 1350; canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  // bg
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0, "#0b0b16"); g.addColorStop(1, "#05050c");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  // accent glow
  const rg = ctx.createRadialGradient(W/2,170,40, W/2,170,560);
  rg.addColorStop(0, accent+"40"); rg.addColorStop(1, "transparent");
  ctx.fillStyle = rg; ctx.fillRect(0,0,W,520);
  // logo
  ctx.textAlign = "center";
  ctx.font = "900 italic 58px Archivo, Arial";
  ctx.fillStyle = "#fff"; ctx.fillText("BEAT", W/2-70, 130);
  ctx.fillStyle = accent; ctx.fillText("THAT", W/2+95, 130);
  // league + (for challenges) the shared Board # so both players' cards match up
  ctx.font = "800 30px Inter, Arial"; ctx.fillStyle = "#9a9ab0";
  const isChallenge = seedInfo && seedInfo.kind==="challenge";
  const sub = isChallenge
    ? `${cfg.label.toUpperCase()} · BOARD #${boardTag(seedInfo.seed)}`
    : `${cfg.label.toUpperCase()} · ${cfg.sub||""}`;
  ctx.fillText(sub, W/2, 185);
  // team name
  if (teamName) { ctx.font = "800 40px Inter, Arial"; ctx.fillStyle = "#f6f6fb"; ctx.fillText(teamName, W/2, 262); }
  // "FINAL RECORD" label so the big number is unmistakable
  ctx.font = "800 26px Inter, Arial"; ctx.fillStyle = "#62627a"; ctx.textAlign = "center";
  ctx.fillText("FINAL RECORD", W/2, teamName ? 312 : 300);
  // big score
  const scoreY = teamName ? 510 : 500;
  ctx.font = "900 210px Archivo, Arial";
  const wins = String(r.wins), losses = String(r.losses);
  ctx.fillStyle = perfect ? "#FFCB45" : "#34e89e"; ctx.textAlign = "right"; ctx.fillText(wins, W/2-36, scoreY);
  ctx.fillStyle = "#3a3a4a"; ctx.textAlign = "center"; ctx.font = "900 120px Archivo, Arial"; ctx.fillText("–", W/2, scoreY-30);
  ctx.fillStyle = r.losses===0 ? "#FFCB45" : "#ff5f6d"; ctx.textAlign = "left"; ctx.font = "900 210px Archivo, Arial"; ctx.fillText(losses, W/2+36, scoreY);
  // W / L cue under the numbers
  ctx.font = "800 28px Inter, Arial"; ctx.fillStyle = "#9a9ab0"; ctx.textAlign = "center";
  ctx.fillText("WINS", W/2-150, scoreY+58);
  ctx.fillText("LOSSES", W/2+150, scoreY+58);
  // tier / perfect label
  ctx.textAlign = "center"; ctx.font = "900 42px Inter, Arial";
  ctx.fillStyle = perfect ? "#FFCB45" : "#f6f6fb";
  const tier = perfect ? `PERFECT ${cfg.chase} — YOU BEAT THAT!` : (cfg.tiers.find(([m])=>r.wins>=m)||["",""])[1];
  ctx.fillText(tier, W/2, scoreY+150);
  let y = scoreY + 250; ctx.textAlign = "left";
  if (full) {
    // FULL share — reveal the whole lineup (players + era/team).
    const slots = cfg.positions;
    const rowH = slots.length >= 8 ? 60 : slots.length >= 7 ? 66 : 74; // tighten for deep rosters
    y = scoreY + 210;
    ctx.font = "800 26px Inter, Arial"; ctx.fillStyle = "#62627a";
    ctx.fillText("THE SQUAD", 110, y); y += 8;
    slots.forEach(slot => {
      const p = lineupA[slot]; if (!p) return; y += rowH;
      const badge = (cfg.slotBadge && cfg.slotBadge[slot]) || slot.replace(/\d$/,"");
      ctx.fillStyle = p.colors ? p.colors[0] : accent;
      ctx.fillRect(110, y-30, 88, 40);
      ctx.fillStyle = "#fff"; ctx.font = "900 21px Archivo, Arial"; ctx.textAlign = "center";
      ctx.fillText(badge, 154, y-2);
      ctx.textAlign = "left"; ctx.font = "800 29px Inter, Arial"; ctx.fillStyle = "#f6f6fb";
      ctx.fillText(p.name, 220, y-6);
      ctx.font = "600 20px Inter, Arial"; ctx.fillStyle = "#62627a";
      ctx.fillText(`${p.era} ${p.team}`, 220, y+16);
    });
  } else {
    // SPOILER-FREE share — score + category grades only, NO players revealed.
    ctx.font = "800 26px Inter, Arial"; ctx.fillStyle = "#62627a";
    ctx.fillText("HOW THE TEAM GRADED OUT", 110, y); y += 14;
    const tierColor = (rt) => rt>=1.15?"#FFCB45":rt>=1.0?"#34e89e":rt>=0.92?"#8fd6a8":rt>=0.80?"#ffb347":"#ff5f6d";
    const tierWord  = (rt) => rt>=1.15?"Elite":rt>=1.0?"Strong":rt>=0.92?"Solid":rt>=0.80?"Shaky":"Weak";
    cfg.cats.forEach(cat => {
      const b = r.breakdown[cat]; const rt = perfect ? 1.2 : b.ratio; y += 64;
      ctx.textAlign = "left"; ctx.font = "800 30px Inter, Arial"; ctx.fillStyle = "#f6f6fb";
      ctx.fillText(cfg.catLabel[cat], 110, y-2);
      ctx.fillStyle = tierColor(rt);
      ctx.beginPath(); ctx.arc(760, y-12, 11, 0, Math.PI*2); ctx.fill();
      ctx.textAlign = "left"; ctx.font = "800 28px Inter, Arial";
      ctx.fillText(tierWord(rt), 790, y-2);
    });
  }
  // footer
  ctx.textAlign = "center"; ctx.font = "700 28px Inter, Arial"; ctx.fillStyle = "#9a9ab0";
  ctx.fillText("Can you beat that?", W/2, H-70);
}

function ResultReveal({ perfect, children }) {
  useEffect(() => {
    // Haptics
    try { if (navigator.vibrate) navigator.vibrate(perfect ? [40,60,40,60,120] : 30); } catch {}
    // Sound — a short celebratory swell for a perfect run, a soft tick otherwise.
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (perfect) {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C-E-G-C major arpeggio
        notes.forEach((f,i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "triangle"; o.frequency.value = f;
          o.connect(g); g.connect(ctx.destination);
          const t = ctx.currentTime + i*0.10;
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t+0.03);
          g.gain.exponentialRampToValueAtTime(0.001, t+0.45);
          o.start(t); o.stop(t+0.5);
        });
      } else {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = 330;
        o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.18);
        o.start(t); o.stop(t+0.2);
      }
    } catch {}
    // eslint-disable-next-line
  }, []);
  return children;
}

// Wordle-style spoiler-free text result — pastes as plain text into any chat.
// Shows the score and a 🟩/🟥 row for each category, without revealing the lineup.
function buildShareText({ cfg, r, perfect, teamName, seedInfo, lineupA }) {
  const head = seedInfo && seedInfo.kind==="daily"
    ? `Beat That ${cfg.label} · Daily #${dayNumber()%100000}`
    : `Beat That ${cfg.label}`;
  const squares = cfg.cats.map(c => r.breakdown[c].total >= r.breakdown[c].floor ? "🟩" : "🟥").join("");
  const scoreLine = `${r.wins}-${r.losses}${perfect ? " — PERFECT! 🏆" : ""}`;
  const who = teamName ? teamName : "I";
  const code = seedInfo ? seedInfo.code : seedToCode(lineupSeed(lineupA||{}) ^ hashStr(cfg.label));
  const cta = (seedInfo && seedInfo.kind==="daily")
    ? `Can you beat that? Same board for everyone today.`
    : `Beat my board — code ${code}`;
  return [head, `${who} went ${scoreLine}`, squares, cta].join("\n");
}

function ResultActions({ cfg, r, perfect, tierLabel, lineupA, teamName, saveTeamName, seedInfo, stats, recordResult, showToast, reset }) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(teamName||"");
  const [cardUrl, setCardUrl] = useState(null);
  const canvasRef = useRef(null);

  // Record the result into stats once when this screen mounts.
  useEffect(() => {
    recordResult(cfg.label, r.wins, cfg.goal, perfect);
    // eslint-disable-next-line
  }, []);

  function buildCard() {
    const canvas = canvasRef.current || document.createElement("canvas");
    canvasRef.current = canvas;
    // Preview shows the FULL version for non-challenge results (the default brag share);
    // for challenges, preview the spoiler-free version (what gets sent).
    const isChallenge = seedInfo && seedInfo.kind==="challenge";
    drawShareCard(canvas, { cfg, r, perfect, teamName, lineupA, seedInfo, full: !isChallenge, accent: cfg.label==="NBA"?"#E8623A":cfg.label==="NCAA"?"#5b9dff":cfg.label==="NFL"?"#34e89e":"#9b8cff" });
    canvas.toBlob(b => { if (b) setCardUrl(URL.createObjectURL(b)); }, "image/png");
  }
  useEffect(() => { buildCard(); /* eslint-disable-next-line */ }, []);

  async function shareCard(full=false) {
    const accent = cfg.label==="NBA"?"#E8623A":cfg.label==="NCAA"?"#5b9dff":cfg.label==="NFL"?"#34e89e":"#9b8cff";
    const canvas = canvasRef.current;
    drawShareCard(canvas, { cfg, r, perfect, teamName, lineupA, accent, seedInfo, full });
    const text = buildShareText({ cfg, r, perfect, teamName, seedInfo, lineupA });
    canvas.toBlob(async (blob) => {
      const file = blob && window.File ? new File([blob], "beat-that.png", { type:"image/png" }) : null;
      try {
        if (navigator.share && file && navigator.canShare && navigator.canShare({ files:[file] })) {
          await navigator.share({ files:[file], text });
          return;
        }
        if (navigator.share) { await navigator.share({ text }); return; }
      } catch {}
      // fallback: copy text + open image
      try { await navigator.clipboard.writeText(text); showToast("Result copied — paste it anywhere"); } catch { showToast("Long-press the card to save it"); }
    }, "image/png");
  }

  // Build a challenge and share it (link if the device supports sharing, else copy).
  async function sendChallenge(type) {
    const seed = seedInfo ? seedInfo.seed : (lineupSeed(lineupA) ^ hashStr(cfg.label)) >>> 0;
    const code = encodeChallenge({ sport: cfg.label, type, seed, wins: r.wins, losses: r.losses, name: teamName });
    const url = challengeUrl(code);
    const line = type === "wild"
      ? `I built a ${r.wins}-${r.losses} squad in ${cfg.label} Beat That. Wild Board challenge — get your own teams and try to top it:`
      : `I went ${r.wins}-${r.losses} in ${cfg.label} Beat That. Same Board challenge — draft the exact same teams and beat me:`;
    const text = `${line}\n${url}`;
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
    } catch {}
    try { await navigator.clipboard.writeText(text); showToast("Challenge link copied — paste it in any chat"); }
    catch { showToast(`Challenge code: ${code}`); }
  }

  // Reply to the person who challenged you with YOUR score — sends the CARD (score +
  // grades + Board #, no players, no link). The Board # ties it to the same duel.
  async function replyWithScore() {
    const opp = seedInfo && seedInfo.opp;
    const seed = seedInfo ? seedInfo.seed : (lineupSeed(lineupA) ^ hashStr(cfg.label)) >>> 0;
    const tag = boardTag(seed);
    const type = seedInfo && seedInfo.challengeType === "wild" ? "wild" : "same";
    let verdict;
    if (opp && ((opp.wins||0)>0 || (opp.losses||0)>0)) {
      const won = r.wins>opp.wins || (r.wins===opp.wins && r.losses<opp.losses);
      const tie = r.wins===opp.wins && r.losses===opp.losses;
      verdict = tie
        ? `We tied at ${r.wins}-${r.losses}! 🤝`
        : won
          ? `Beat your ${opp.wins}-${opp.losses} — I went ${r.wins}-${r.losses}! 🏆`
          : `You got me — you ${opp.wins}-${opp.losses}, me ${r.wins}-${r.losses}.`;
    } else {
      verdict = `I went ${r.wins}-${r.losses}.`;
    }
    // Caption: score + Board # so scores match up. NO link, NO players.
    const caption = `🏟️ Board #${tag} · ${type==="wild"?"Wild":"Same"} Board · ${cfg.label} Beat That\n${verdict}`;
    const accent = cfg.label==="NBA"?"#E8623A":cfg.label==="NCAA"?"#5b9dff":cfg.label==="NFL"?"#34e89e":"#9b8cff";
    const canvas = canvasRef.current;
    drawShareCard(canvas, { cfg, r, perfect, teamName, lineupA, accent, seedInfo });
    canvas.toBlob(async (blob) => {
      const file = blob && window.File ? new File([blob], "beat-that.png", { type:"image/png" }) : null;
      try {
        if (navigator.share && file && navigator.canShare && navigator.canShare({ files:[file] })) {
          await navigator.share({ files:[file], text: caption }); return;
        }
        if (navigator.share) { await navigator.share({ text: caption }); return; }
      } catch {}
      try { await navigator.clipboard.writeText(caption); showToast("Score copied — paste it back in your chat"); }
      catch { showToast("Long-press the card to save it"); }
    }, "image/png");
  }

  const accent = cfg.label==="NBA"?"#E8623A":cfg.label==="NCAA"?"#5b9dff":cfg.label==="NFL"?"#34e89e":"#9b8cff";

  return (
    <div>
      {/* Team identity */}
      <div style={s.card}>
        <div style={s.eyebrow}>Team name</div>
        {editing ? (
          <div style={{ display:"flex", gap:8 }}>
            <input autoFocus value={nameInput} onChange={e=>setNameInput(e.target.value.slice(0,28))} placeholder="Name your squad…"
              style={{ flex:1, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.05)", color:C.text, fontSize:15, fontWeight:700, outline:"none" }} />
            <button className="bt-press" style={{ ...s.btn(accent,"#06120c"), width:"auto", marginTop:0, padding:"12px 18px" }} onClick={()=>{ saveTeamName(nameInput.trim()); setEditing(false); buildCard(); showToast("Team name saved"); }}>Save</button>
          </div>
        ) : (
          <div style={{ ...s.row }}>
            <div style={{ fontSize:18, fontWeight:800, color: teamName?C.text:C.dim }}>{teamName || "Unnamed Squad"}</div>
            <button className="bt-press" style={{ ...s.ghost, width:"auto", marginTop:0, padding:"8px 14px" }} onClick={()=>{ setNameInput(teamName||""); setEditing(true); }}>{teamName?"Edit":"Add name"}</button>
          </div>
        )}
      </div>

      {/* Shareable card — for non-challenge results only (challenges have their own share). */}
      {!(seedInfo && seedInfo.kind==="challenge") && (
        <div style={s.card}>
          <div style={s.eyebrow}>📸 Share your result</div>
          {cardUrl
            ? <img src={cardUrl} alt="Result card" style={{ width:"100%", borderRadius:14, display:"block", border:`1px solid ${C.border}` }} />
            : <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:C.dim }}>Building card…</div>}
          <button className="bt-press" style={s.btn(accent,"#06120c")} onClick={()=>shareCard(true)}>Share full team 🏆</button>
          <div style={{ fontSize:11, color:C.dim, marginTop:4, marginBottom:10, lineHeight:1.4, textAlign:"center" }}>Shows your whole lineup and stats — the brag version.</div>
          <button className="bt-press" style={s.ghost} onClick={()=>shareCard(false)}>Share spoiler-free 🙈</button>
          <div style={{ fontSize:11, color:C.dim, marginTop:4, lineHeight:1.4, textAlign:"center" }}>Score and grades only — no players given away.</div>
        </div>
      )}

      {/* If THIS game was an incoming challenge, show how you did vs the sender */}
      {seedInfo && seedInfo.opp && ((seedInfo.opp.wins||0)>0 || (seedInfo.opp.losses||0)>0) && (
        <div style={{ ...s.card, borderColor: (r.wins>seedInfo.opp.wins||(r.wins===seedInfo.opp.wins&&r.losses<seedInfo.opp.losses))?C.green:C.red }}>
          <div style={s.eyebrow}>⚔️ Challenge result</div>
          {(() => {
            const me = r.wins, them = seedInfo.opp.wins;
            const oppName = seedInfo.opp.name || "Your challenger";
            const sameBoard = seedInfo.challengeType !== "wild";
            const won = me>them || (me===them && r.losses<seedInfo.opp.losses);
            const tie = me===them && r.losses===seedInfo.opp.losses;
            return (
              <div>
                <div style={{ fontSize:20, fontWeight:900, color: tie?C.gold:won?C.green:C.red, fontFamily:"'Archivo',sans-serif" }}>
                  {tie ? "Dead heat!" : won ? "You win! 🏆" : "You came up short"}
                </div>
                <div style={{ fontSize:13.5, color:C.muted, marginTop:6, lineHeight:1.5 }}>
                  You went <b style={{color:C.text}}>{r.wins}-{r.losses}</b>; {oppName} went <b style={{color:C.text}}>{seedInfo.opp.wins}-{seedInfo.opp.losses}</b>.
                  {sameBoard ? " Same board, so this is a clean head-to-head." : " Different boards — bragging rights only."}
                </div>
                {cardUrl && <img src={cardUrl} alt="Result card" style={{ width:"100%", borderRadius:14, display:"block", border:`1px solid ${C.border}`, marginTop:12 }} />}
                <button className="bt-press" style={{ ...s.btn(won?C.green:accent, "#06120c"), marginTop:12 }} onClick={replyWithScore}>📲 Send result to chat</button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Challenge with no posted opponent score yet (an invitation you accepted, OR the
          board you just sent as the challenger): report your result back to the chat. */}
      {seedInfo && seedInfo.kind==="challenge" && (!seedInfo.opp || ((seedInfo.opp.wins||0)===0 && (seedInfo.opp.losses||0)===0)) && (
        <div style={s.card}>
          <div style={s.eyebrow}>⚔️ {seedInfo.sentInvite ? "You sent this challenge" : "Challenge accepted"}</div>
          <p style={{ margin:"0 0 12px", fontSize:13, color:C.muted, lineHeight:1.5 }}>
            {seedInfo.sentInvite
              ? `You went ${r.wins}-${r.losses} on the board you sent. Post your score so they know what to beat.`
              : `You went ${r.wins}-${r.losses}. Post your score so they can see how you did.`}
          </p>
          {cardUrl && <img src={cardUrl} alt="Result card" style={{ width:"100%", borderRadius:14, display:"block", border:`1px solid ${C.border}`, marginBottom:12 }} />}
          <button className="bt-press" style={{ ...s.btn(accent,"#06120c"), marginTop:0 }} onClick={replyWithScore}>📲 Send result to chat</button>
        </div>
      )}

      {/* Start a NEW challenge from this same board (sends invite first, like the home flow) */}
      {seedInfo && seedInfo.kind==="challenge" && (
        <div style={s.card}>
          <div style={s.eyebrow}>⚔️ Challenge someone new</div>
          <p style={{ margin:"0 0 12px", fontSize:13, color:C.muted, lineHeight:1.5 }}>Send a fresh challenge — the invite goes out first, then they draft.</p>
          <button className="bt-press bt-card-hover" onClick={()=>sendChallenge("same")} style={{ width:"100%", textAlign:"left", padding:"15px 16px", marginBottom:9, borderRadius:14, cursor:"pointer", background:`linear-gradient(145deg, ${accent}1f, transparent)`, border:`1.5px solid ${accent}66`, color:C.text }}>
            <div style={{ fontWeight:800, fontSize:15, display:"flex", alignItems:"center", gap:7 }}>🎯 Same Board</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4, lineHeight:1.45 }}>They draft the exact same teams you'd face. A pure duel.</div>
          </button>
          <button className="bt-press bt-card-hover" onClick={()=>sendChallenge("wild")} style={{ width:"100%", textAlign:"left", padding:"15px 16px", borderRadius:14, cursor:"pointer", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, color:C.text }}>
            <div style={{ fontWeight:800, fontSize:15, display:"flex", alignItems:"center", gap:7 }}>🎲 Wild Board</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4, lineHeight:1.45 }}>They get their own random teams. Luck of the draw.</div>
          </button>
        </div>
      )}

      <button className="bt-press" style={s.btn()} onClick={reset}>Play Again</button>
    </div>
  );
}

export default function BeatThat() {
  // Inject display font + global polish (press feedback, font smoothing) once.
  useEffect(() => {
    if (document.getElementById("bt-fonts")) return;
    const link = document.createElement("link");
    link.id = "bt-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      * { -webkit-font-smoothing:antialiased; box-sizing:border-box; }
      .bt-press:active { transform:scale(0.97); }
      .bt-card-hover { transition: transform 0.15s ease, border-color 0.2s ease; }
      @keyframes btPop { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
      @keyframes btSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      .bt-pop { animation: btPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
      .bt-slide { animation: btSlide 0.35s ease both; }
      @media (prefers-reduced-motion: reduce){ .bt-pop,.bt-slide{animation:none} }
    `;
    document.head.appendChild(style);
  }, []);
  const [screen, setScreen] = useState("home");
  const [sport, setSport] = useState("NBA");
  const [mode, setMode] = useState(null);
  const [lineupA, setLineupA] = useState({});
  const [rollA, setRollA] = useState(null);
  const [reTeamA, setReTeamA] = useState(0);
  const [reEraA, setReEraA] = useState(0);
  const [lineupB, setLineupB] = useState({});
  const [rollB, setRollB] = useState(null);
  const [reTeamB, setReTeamB] = useState(0);
  const [reEraB, setReEraB] = useState(0);
  const [activeTeam, setActiveTeam] = useState("A");
  const [teamNameA, setTeamNameA] = useState("");
  const [teamNameB, setTeamNameB] = useState("");
  // Seeded play: when set, rolls come from a deterministic board (daily or challenge code).
  const [seedInfo, setSeedInfo] = useState(null); // { kind:"daily"|"challenge", seed, code, label }
  const seedRngA = useRef(null);
  const seedRngB = useRef(null);
  const [stats, setStats] = useState(null); // persisted: { games, perfect, byLeague:{...}, streak, lastDay }
  const [toast, setToast] = useState("");
  const [codeEntry, setCodeEntry] = useState("");
  const [incomingChallenge, setIncomingChallenge] = useState(null); // decoded ?c= link
  const [shareRef, setShareRef] = useState(null); // DOM node of the share card to export

  // Load persistent stats once.
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("bt:stats");
        if (r && r.value) setStats(JSON.parse(r.value));
        else setStats({ games:0, perfect:0, byLeague:{}, bestWins:{}, streak:0, lastDailyDay:null });
      } catch { setStats({ games:0, perfect:0, byLeague:{}, bestWins:{}, streak:0, lastDailyDay:null }); }
      // restore saved team name
      try { const n = await window.storage.get("bt:teamName"); if (n && n.value) { setTeamNameA(n.value); } } catch {}
    })();
  }, []);

  // If the app was opened from a challenge link (?c=CODE), decode it and prompt to play.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("c");
      if (c) {
        const ch = decodeChallenge(c);
        if (ch) setIncomingChallenge(ch);
        // clean the URL so a refresh doesn't re-trigger
        window.history.replaceState({}, "", window.location.pathname);
      }
    } catch {}
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(""), 2200); }

  async function persistStats(next) {
    setStats(next);
    try { await window.storage.set("bt:stats", JSON.stringify(next)); } catch {}
  }
  async function saveTeamName(name) {
    setTeamNameA(name);
    try { await window.storage.set("bt:teamName", name); } catch {}
  }

  // Record a finished season into persistent stats (deduped per unique result view).
  const recordedKey = useRef(null);
  // Guess-the-Lineup stats: own streak, separate from the draft daily.
  function recordPuzzle(puzzleId, solved, misses) {
    if (!stats) return;
    const today = dayNumber();
    const next = JSON.parse(JSON.stringify(stats));
    next.puzzle = next.puzzle || { played:0, solved:0, streak:0, lastDay:null, best:null };
    if (next.puzzle.lastDay === today) { persistStats(next); return; } // already counted today
    next.puzzle.played += 1;
    if (solved) {
      next.puzzle.solved += 1;
      next.puzzle.streak = (next.puzzle.lastDay === today-1) ? next.puzzle.streak+1 : 1;
      if (next.puzzle.best===null || misses < next.puzzle.best) next.puzzle.best = misses;
    } else {
      next.puzzle.streak = 0;
    }
    next.puzzle.lastDay = today;
    persistStats(next);
  }
  function recordResult(lg, wins, goal, isPerfect) {
    if (!stats) return;
    const key = `${lg}:${wins}:${goal}:${JSON.stringify(lineupA)}`;
    if (recordedKey.current === key) return; // already logged this exact result
    recordedKey.current = key;
    const next = JSON.parse(JSON.stringify(stats));
    next.games = (next.games||0) + 1;
    if (isPerfect) next.perfect = (next.perfect||0) + 1;
    next.byLeague = next.byLeague || {};
    next.byLeague[lg] = (next.byLeague[lg]||0) + 1;
    next.bestWins = next.bestWins || {};
    if (!next.bestWins[lg] || wins > next.bestWins[lg]) next.bestWins[lg] = wins;
    // daily streak bookkeeping
    if (seedInfo && seedInfo.kind==="daily") {
      const today = dayNumber();
      if (next.lastDailyDay === today - 1 || next.lastDailyDay === today) {
        if (next.lastDailyDay !== today) next.streak = (next.streak||0) + 1;
      } else {
        next.streak = 1;
      }
      next.lastDailyDay = today;
    }
    persistStats(next);
  }

  const cfg       = SPORTS[sport];
  const SLOTS     = cfg.positions;
  const CATS_S    = cfg.cats;
  const LABELS_S  = cfg.catLabel;
  const lineup    = activeTeam==="A"?lineupA:lineupB;
  const setLineup = activeTeam==="A"?setLineupA:setLineupB;
  const roll      = activeTeam==="A"?rollA:rollB;
  const setRoll   = activeTeam==="A"?setRollA:setRollB;
  const reTeam    = activeTeam==="A"?reTeamA:reTeamB;
  const setReTeam = activeTeam==="A"?setReTeamA:setReTeamB;
  const reEra     = activeTeam==="A"?reEraA:reEraB;
  const setReEra  = activeTeam==="A"?setReEraA:setReEraB;

  // Which player positions can fill a given slot (NFL slots like WR1/WR2 map to "WR").
  function slotAccepts(slot) { return cfg.slotPos ? (cfg.slotPos[slot]||[slot]) : [slot]; }
  function playerFitsSlot(player, slot) { return player.pos.some(pp => slotAccepts(slot).includes(pp)); }

  const filled   = SLOTS.filter(s => lineup[s]);
  const open     = SLOTS.filter(s => !lineup[s]);
  const complete = open.length === 0;
  const DATA     = cfg.data;
  const teamData = roll ? DATA[roll.era][roll.team] : null;
  // Show the FULL roster ordered by POSITION GROUP (not by rank) so the player
  // has to read the stats and decide for themselves — no "best player" is flagged.
  const players  = teamData ? (() => {
    const order = {}; cfg.positions.forEach((slot,i)=>{ slotAccepts(slot).forEach(pp=>{ if(order[pp]===undefined) order[pp]=i; }); });
    return [...teamData.players].sort((a,b)=>{
      const oa = Math.min(...a.pos.map(p=>order[p]!==undefined?order[p]:99));
      const ob = Math.min(...b.pos.map(p=>order[p]!==undefined?order[p]:99));
      if (oa!==ob) return oa-ob;
      return a.name.localeCompare(b.name); // stable alphabetical within a position group
    });
  })() : [];
  const accent   = teamData ? teamData.colors[0] : C.gold;
  const accent2  = teamData ? teamData.colors[1] : C.gold;

  // DAILY MODE: assign each player exactly ONE position, chosen so the team still
  // covers every required slot (a guaranteed-fillable matching). Prefer each
  // player's primary (first-listed) position; only reassign when needed for coverage.
  const dailyPos = (() => {
    if (!teamData || !(seedInfo && seedInfo.kind==="daily")) return null;
    const roster = teamData.players;
    const slotNeeds = SLOTS.map(s => slotAccepts(s));
    // Find a full assignment of distinct players to slots, but PREFER each player's
    // primary (first-listed) position so stars aren't yanked to odd spots (e.g. LeBron
    // shouldn't become a point guard just to fill a hole). We try primary-only first,
    // and only allow a player to flex to a secondary position when coverage requires it.
    function match(maxFlex) {
      const used = new Set(); const chosen = {};
      function bt(k) {
        if (k === slotNeeds.length) return true;
        const accepts = slotNeeds[k];
        for (let i=0;i<roster.length;i++) {
          if (used.has(i)) continue;
          const pl = roster[i];
          // candidate positions this player could take for this slot, primary-first
          const cands = pl.pos.filter(p => accepts.includes(p));
          for (const pos of cands) {
            const flexCost = pl.pos.indexOf(pos); // 0 = primary, >0 = flexed
            if (flexCost > maxFlex) continue;
            used.add(i); chosen[pl.name] = pos;
            if (bt(k+1)) return true;
            used.delete(i); delete chosen[pl.name];
          }
        }
        return false;
      }
      return bt(0) ? chosen : null;
    }
    // Increase allowed flex until a full lineup is coverable.
    let assign = null;
    for (let flex=0; flex<=4 && !assign; flex++) assign = match(flex);
    assign = assign || {};
    // Bench players (not needed for coverage) always keep their primary position.
    roster.forEach(pl => { if (!assign[pl.name]) assign[pl.name] = pl.pos[0]; });
    return assign;
  })();

  function startMode(m) {
    setMode(m);
    setSeedInfo(null); seedRngA.current = null; seedRngB.current = null;
    setLineupA({}); setRollA(null); setReTeamA(0); setReEraA(0);
    setLineupB({}); setRollB(null); setReTeamB(0); setReEraB(0);
    setActiveTeam("A"); setScreen("draft");
  }
  // Launch a seeded board: daily challenge or a friend's head-to-head code.
  function startSeeded(kind, seed, codeLabel, opts={}) {
    if (opts.sport && opts.sport !== sport) setSport(opts.sport);
    setMode("season");
    const code = seedToCode(seed);
    setSeedInfo({
      kind, seed, code,
      label: codeLabel || (kind==="daily" ? "Daily Challenge" : `Challenge ${code}`),
      challengeType: opts.challengeType || null,      // "same" | "wild" | null
      opp: opts.opp || null,                          // { wins, losses, name } of the sender
      sentInvite: opts.sentInvite || false,           // true if you sent the invite before drafting
    });
    // Wild boards are NOT seeded — each player gets their own random rolls.
    const seeded = opts.challengeType !== "wild";
    seedRngA.current = seeded ? mulberry32(seed) : null;
    seedRngB.current = seeded ? mulberry32(seed) : null;
    setLineupA({}); setRollA(null); setReTeamA(0); setReEraA(0);
    setLineupB({}); setRollB(null); setReTeamB(0); setReEraB(0);
    setActiveTeam("A"); setScreen("draft");
  }
  // Launch a game from an incoming challenge link/code.
  function playChallenge(ch) {
    setIncomingChallenge(null);
    startSeeded("challenge", ch.seed, ch.type==="wild" ? "Wild Board challenge" : "Same Board challenge", {
      sport: ch.sport,
      challengeType: ch.type,
      opp: { wins: ch.wins, losses: ch.losses, name: ch.name },
    });
  }
  // Start authoring a challenge from the home page: you play a fresh board first,
  // then the result screen hands you the link to send. No opponent yet (you're the sender).
  async function authorChallenge(type) {
    const seed = (Math.floor(Math.random()*0xFFFFFFFF)) >>> 0;
    // Build the invite link NOW — board only, no score (you haven't drafted yet).
    // wins/losses encoded as 0; the recipient just gets the board to play.
    const code = encodeChallenge({ sport: cfg.label, type, seed, wins: 0, losses: 0, name: teamNameA });
    const url = challengeUrl(code);
    const btag = boardTag(seed);
    const who = teamNameA ? `${teamNameA} challenges you` : "I challenge you";
    const line = type === "wild"
      ? `${who} in ${cfg.label} Beat That! 🎲 Wild Board — you get your own random teams. Build the best squad you can and let's see who wins:`
      : `${who} in ${cfg.label} Beat That! 🎯 Same Board — we both draft the exact same teams. May the better GM win:`;
    const text = `🏟️ Board #${btag}\n${line}\n${url}`;
    // Send the invite first.
    try {
      if (navigator.share) { await navigator.share({ text }); }
      else { await navigator.clipboard.writeText(text); showToast("Challenge copied — paste it in your chat"); }
    } catch {
      try { await navigator.clipboard.writeText(text); showToast("Challenge copied — paste it in your chat"); } catch {}
    }
    // Then drop into drafting the very same board.
    startSeeded("challenge", seed, type==="wild" ? "Wild Board challenge" : "Same Board challenge", {
      challengeType: type,
      opp: null,
      sentInvite: true,
    });
  }
  function doRoll() {
    if (seedInfo) {
      const rng = activeTeam==="A" ? seedRngA.current : seedRngB.current;
      if (rng) {
        // Daily mode forces single-position play, so only roll teams that stay fillable.
        const slotNeeds = seedInfo.kind==="daily" ? SLOTS.map(s => slotAccepts(s)) : null;
        setRoll(seededRoll(DATA, rng, slotNeeds));
        return;
      }
    }
    setRoll(rollTeamEra(DATA));
  }
  function doReTeam() {
    if (seedInfo) return; // seeded boards are fixed for everyone
    if (reTeam >= cfg.rerolls || !roll) return;
    const teams = Object.keys(DATA[roll.era]).filter(t => t!==roll.team);
    if (!teams.length) return;
    setRoll({ era: roll.era, team:teams[Math.floor(Math.random()*teams.length)] });
    setReTeam(reTeam+1);
  }
  function doReEra() {
    if (seedInfo) return; // seeded boards are fixed for everyone
    if (reEra >= cfg.rerolls || !roll) return;
    const erasWithTeam = Object.keys(DATA).filter(e => e!==roll.era && DATA[e][roll.team]);
    if (!erasWithTeam.length) return;
    const era = erasWithTeam[Math.floor(Math.random()*erasWithTeam.length)];
    setRoll({ era, team: roll.team });
    setReEra(reEra+1);
  }
  const eraRerollPossible = roll ? Object.keys(DATA).some(e => e!==roll.era && DATA[e][roll.team]) : false;

  // Draft a player into a slot. If that slot is occupied by an already-drafted player
  // who can legally move to another OPEN slot, relocate them first.
  function pickPlayer(player, slot) {
    setLineup(prev => {
      const next = { ...prev };
      const occupant = next[slot];
      if (occupant) {
        const takenAfter = SLOTS.filter(s => next[s] && s !== slot);
        const openSlots = SLOTS.filter(s => !takenAfter.includes(s) && s !== slot);
        const moveTo = openSlots.find(s => playerFitsSlot(occupant, s));
        if (moveTo) next[moveTo] = occupant;
      }
      next[slot] = { ...player, team:roll.team, era:roll.era, colors:teamData.colors };
      return next;
    });
    setRoll(null);
  }

  // Can this NEW player be drafted into `slot`? Either slot is open, OR it's filled by a
  // movable player who can shift to another open slot.
  function canDraftAt(slot) {
    if (open.includes(slot)) return true;
    const occupant = lineup[slot];
    if (!occupant) return false;
    const takenElsewhere = filled.filter(s => s !== slot);
    const openSlots = SLOTS.filter(s => !takenElsewhere.includes(s) && s !== slot);
    return openSlots.some(s => playerFitsSlot(occupant, s));
  }
  function finishDraft() {
    if (mode==="season") { setScreen("result"); return; }
    if (activeTeam==="A") { setActiveTeam("B"); setScreen("draft"); }
    else setScreen("h2h_result");
  }
  function reset() {
    setMode(null);
    setLineupA({}); setRollA(null); setReTeamA(0); setReEraA(0);
    setLineupB({}); setRollB(null); setReTeamB(0); setReEraB(0);
    setActiveTeam("A"); setScreen("home");
  }
  const goHome = reset; // the logo in every header calls this to return to the home screen

  // ── HOME ──
  if (screen==="puzzle") {
    return (
      <PuzzleGame
        puzzle={dailyPuzzle()} accent="#E8623A"
        onExit={()=>setScreen("home")}
        puzzleStats={stats && stats.puzzle}
        recordPuzzle={recordPuzzle}
        showToast={showToast}
      />
    );
  }

  if (screen==="home") {
    const sportAccent = { NBA:"#E8623A", NCAA:"#5b9dff", NFL:"#34e89e", NHL:"#9b8cff" }[sport] || C.gold;
    const sportEmoji = { NBA:"🏀", NCAA:"🎓", NFL:"🏈", NHL:"🏒" };
    return (
    <div style={s.app}>
      <div style={{ ...s.glow, background:`radial-gradient(ellipse at center, ${sportAccent}22, transparent 70%)` }} />
      <div style={s.wrap}>
        {incomingChallenge && (() => {
          const namer = incomingChallenge.name || "A friend";
          const tag = boardTag(incomingChallenge.seed);
          const isWild = incomingChallenge.type==="wild";
          return (
          <div style={{ marginTop:18, marginBottom:4, padding:"20px", borderRadius:18, background:`linear-gradient(145deg, ${C.gold}26, ${C.gold}08)`, border:`1.5px solid ${C.gold}77`, boxShadow:`0 8px 30px ${C.gold}1a` }}>
            <div style={{ fontSize:12, fontWeight:800, letterSpacing:0.8, color:C.gold, textTransform:"uppercase" }}>⚔️ You've been challenged</div>
            <div style={{ fontSize:17, fontWeight:800, color:C.text, marginTop:8, lineHeight:1.4 }}>
              {namer} challenged you to a {incomingChallenge.sport} duel.
            </div>
            <div style={{ fontSize:12.5, color:C.gold, fontWeight:700, marginTop:4 }}>🏟️ Board #{tag} · {isWild ? "Wild Board" : "Same Board"}</div>

            {/* What to do — simple numbered steps */}
            <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:9 }}>
              {[
                ["1", "Accept the challenge", "Tap Accept to start your draft on this board."],
                ["2", "Build your lineup", isWild ? "You'll get your own random teams. Draft the best squad you can." : "You'll get the very same teams your challenger did."],
                ["3", "Share your score", "When you finish, tap “Send result to chat” to share your result — then compare and see who won."],
              ].map(([n,title,desc]) => (
                <div key={n} style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:C.gold, color:"#0a0a0f", fontWeight:900, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:800, color:C.text }}>{title}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:1, lineHeight:1.4 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button className="bt-press" style={{ ...s.btn(C.gold,"#0a0a0f"), marginTop:0 }} onClick={()=>playChallenge(incomingChallenge)}>Accept challenge</button>
              <button className="bt-press" style={{ ...s.ghost, marginTop:0, width:"auto", padding:"12px 16px" }} onClick={()=>setIncomingChallenge(null)}>Maybe later</button>
            </div>
          </div>
          );
        })()}
        <div className="bt-slide" style={{ textAlign:"center", padding:"40px 0 26px" }}>
          <h1 style={{ fontFamily:"'Archivo','Inter',sans-serif", fontSize:58, fontWeight:900, margin:0, letterSpacing:"-3px", textTransform:"uppercase", fontStyle:"italic", color:"#fff", lineHeight:0.9 }}>
            Beat <span style={{ color:sportAccent, textShadow:`0 0 40px ${sportAccent}66` }}>That</span>
          </h1>
          <p style={{ color:C.muted, marginTop:18, fontSize:14.5, lineHeight:1.55, maxWidth:380, marginLeft:"auto", marginRight:"auto" }}>Draft your {SPORTS[sport].noun} — {SPORTS[sport].positions.length} picks across the eras. No rankings, just real stats. Can it go {SPORTS[sport].chase}?</p>
        </div>
        {/* Sport selector — bento grid */}
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 2px 12px" }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:C.dim, textTransform:"uppercase" }}>Step 1 · Pick a league</span>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg, ${C.border}, transparent)` }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:14 }}>
          {Object.keys(SPORTS).map(sp => {
            const active = sport===sp;
            const acc = { NBA:"#E8623A", NCAA:"#5b9dff", NFL:"#34e89e", NHL:"#9b8cff" }[sp];
            return (
              <button key={sp} className="bt-press bt-card-hover" onClick={()=>setSport(sp)} style={{ padding:"18px 14px", borderRadius:18, cursor:"pointer", textAlign:"left", background: active?`linear-gradient(145deg, ${acc}26, ${acc}0d)`:"rgba(255,255,255,0.03)", border:`1.5px solid ${active?acc:C.border}`, color:C.text, backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", boxShadow: active?`0 6px 20px ${acc}33`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:26 }}>{sportEmoji[sp]}</span>
                  {active && <span style={{ width:10, height:10, borderRadius:"50%", background:acc, boxShadow:`0 0 10px ${acc}` }} />}
                </div>
                <div style={{ fontFamily:"'Archivo','Inter',sans-serif", fontWeight:800, fontSize:18, marginTop:10, letterSpacing:0.2 }}>{SPORTS[sp].label}</div>
                <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>{SPORTS[sp].sub}</div>
              </button>
            );
          })}
        </div>
        {/* Mode selector — four games: Daily, Challenge, Guess, Build */}
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"22px 2px 12px" }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:C.dim, textTransform:"uppercase" }}>Step 2 · Pick a game</span>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg, ${C.border}, transparent)` }} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {/* 1 — DAILY */}
          <button className="bt-press bt-card-hover" style={{ width:"100%", padding:"16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:18, color:C.text, cursor:"pointer", textAlign:"left", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", display:"flex", gap:14, alignItems:"flex-start" }} onClick={()=>startSeeded("daily", dailySeed(sport))}>
            <div style={{ width:46, height:46, borderRadius:13, background:`${sportAccent}1f`, border:`1px solid ${sportAccent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:23, flexShrink:0 }}>🗓️</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:16.5 }}>Daily Challenge</div>
              <div style={{ fontSize:12.5, color:C.muted, marginTop:3, lineHeight:1.45 }}>Same {SPORTS[sport].label} board for everyone today. Experts mode — no rerolls, one position per player, stats hidden.</div>
            </div>
          </button>

          {/* 2 — CHALLENGE a friend (remote head-to-head via link) */}
          <div style={{ width:"100%", padding:"16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:18, backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)" }}>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:46, height:46, borderRadius:13, background:`${sportAccent}1f`, border:`1px solid ${sportAccent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:23, flexShrink:0 }}>📲</div>
              <div style={{ fontWeight:800, fontSize:16.5 }}>Challenge a Friend</div>
            </div>
            <button className="bt-press bt-card-hover" onClick={()=>authorChallenge("same")} style={{ width:"100%", textAlign:"left", padding:"13px 14px", marginTop:13, borderRadius:13, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, color:C.text }}>
              <div style={{ fontWeight:800, fontSize:14.5, display:"flex", alignItems:"center", gap:7 }}>🎯 Same Board</div>
              <div style={{ fontSize:11.5, color:C.muted, marginTop:3, lineHeight:1.4 }}>Same teams, same rolls. A pure duel — whoever drafts the better squad wins.</div>
            </button>
            <button className="bt-press bt-card-hover" onClick={()=>authorChallenge("wild")} style={{ width:"100%", textAlign:"left", padding:"13px 14px", marginTop:9, borderRadius:13, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, color:C.text }}>
              <div style={{ fontWeight:800, fontSize:14.5, display:"flex", alignItems:"center", gap:7 }}>🎲 Wild Board</div>
              <div style={{ fontSize:11.5, color:C.muted, marginTop:3, lineHeight:1.4 }}>Different teams for each of you. Luck of the draw — brag about the best squad you can build.</div>
            </button>
          </div>

          {/* 3 — GUESS the lineup */}
          <button className="bt-press bt-card-hover" style={{ width:"100%", padding:"16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:18, color:C.text, cursor:"pointer", textAlign:"left", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", display:"flex", gap:14, alignItems:"flex-start" }} onClick={()=>setScreen("puzzle")}>
            <div style={{ width:46, height:46, borderRadius:13, background:`${sportAccent}1f`, border:`1px solid ${sportAccent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:23, flexShrink:0 }}>🧠</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:16.5 }}>Guess the Lineup {stats && stats.puzzle && stats.puzzle.streak>0 ? <span style={{ fontSize:12, color:C.muted, fontWeight:700 }}>🔥 {stats.puzzle.streak}</span> : ""}</div>
              <div style={{ fontSize:12.5, color:C.muted, marginTop:3, lineHeight:1.45 }}>One famous NBA lineup, hidden. Name all five from clues — fewer misses is better. New puzzle daily.</div>
            </div>
          </button>

          {/* 4 — BUILD a season */}
          <button className="bt-press bt-card-hover" style={{ width:"100%", padding:"16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:18, color:C.text, cursor:"pointer", textAlign:"left", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", display:"flex", gap:14, alignItems:"flex-start" }} onClick={()=>startMode("season")}>
            <div style={{ width:46, height:46, borderRadius:13, background:`${sportAccent}1f`, border:`1px solid ${sportAccent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:23, flexShrink:0 }}>🏗️</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:16.5 }}>Build a Season</div>
              <div style={{ fontSize:12.5, color:C.muted, marginTop:3, lineHeight:1.45 }}>Draft one {SPORTS[sport].label} lineup at your own pace and chase a perfect {SPORTS[sport].chase}.</div>
            </div>
          </button>

          {/* Paste a challenge code */}
          <div style={{ display:"flex", gap:8 }}>
            <input value={codeEntry} onChange={e=>setCodeEntry(e.target.value.toUpperCase().replace(/[^A-Z0-9~%.-]/g,"").slice(0,60))} placeholder="Paste a challenge code"
              style={{ flex:1, padding:"14px", borderRadius:14, border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.04)", color:C.text, fontSize:14, fontWeight:700, outline:"none", letterSpacing:1 }} />
            <button className="bt-press" disabled={!codeEntry} style={{ ...s.btn(C.gold,"#0a0a0f"), width:"auto", marginTop:0, padding:"14px 20px", opacity:codeEntry?1:0.4 }}
              onClick={()=>{
                const ch = decodeChallenge(codeEntry);
                if (ch) { playChallenge(ch); }
                else { const seed=codeToSeed(codeEntry); if(!isNaN(seed)){ startSeeded("challenge", seed, `Challenge ${codeEntry}`); } else { showToast("Invalid code"); } }
              }}>Go</button>
          </div>
        </div>

        {/* Your stats */}
        {stats && stats.games>0 && (
          <div style={{ ...s.card, marginTop:14 }}>
            <div style={s.eyebrow}>📈 Your record</div>
            <div style={{ display:"flex", justifyContent:"space-around", textAlign:"center" }}>
              <div><div style={{ fontFamily:"'Archivo',sans-serif", fontSize:30, fontWeight:900, color:C.text }}>{stats.games}</div><div style={{ fontSize:10.5, color:C.muted, fontWeight:700, letterSpacing:0.5 }}>SEASONS</div></div>
              <div><div style={{ fontFamily:"'Archivo',sans-serif", fontSize:30, fontWeight:900, color:C.gold }}>{stats.perfect||0}</div><div style={{ fontSize:10.5, color:C.muted, fontWeight:700, letterSpacing:0.5 }}>PERFECT</div></div>
              <div><div style={{ fontFamily:"'Archivo',sans-serif", fontSize:30, fontWeight:900, color:sportAccent }}>{(stats.bestWins&&stats.bestWins[sport])||0}</div><div style={{ fontSize:10.5, color:C.muted, fontWeight:700, letterSpacing:0.5 }}>BEST {sport}</div></div>
              {stats.streak>0 && <div><div style={{ fontFamily:"'Archivo',sans-serif", fontSize:30, fontWeight:900, color:C.green }}>{stats.streak}🔥</div><div style={{ fontSize:10.5, color:C.muted, fontWeight:700, letterSpacing:0.5 }}>DAILY STREAK</div></div>}
            </div>
          </div>
        )}
      </div>
      {toast && <div style={{ position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)", background:"rgba(20,20,32,0.95)", color:C.text, padding:"12px 22px", borderRadius:999, fontSize:13.5, fontWeight:700, border:`1px solid ${C.borderBright}`, zIndex:50, backdropFilter:"blur(12px)" }}>{toast}</div>}
    </div>
    );
  }

  // ── DRAFT ──
  if (screen==="draft") {
    const teamColor = activeTeam==="A"?C.green:C.blue;
    return (
      <div style={s.app}>
      <div style={s.glow} />
        <div style={s.hdr}>
          <div style={{ ...s.logo, cursor:"pointer" }} onClick={goHome} title="Back to home">BEAT <span style={{ color:C.gold }}>THAT</span></div>
          <div style={{ fontSize:13, color:C.muted }}>{cfg.label} · {mode==="h2h"?`Team ${activeTeam} · `:""}{filled.length}/{SLOTS.length}</div>
          <button onClick={reset} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>&#8592; Menu</button>
        </div>
        <div style={s.wrap}>
          {seedInfo && (
            <div style={{ textAlign:"center", marginBottom:12, padding:"10px 14px", borderRadius:14, background:`linear-gradient(145deg, ${C.gold}22, transparent)`, border:`1px solid ${C.gold}55` }}>
              <div style={{ fontSize:13, color:C.gold, fontWeight:800, letterSpacing:0.5 }}>
                {seedInfo.kind==="daily"
                  ? "🗓️ DAILY CHALLENGE · EXPERTS MODE"
                  : `⚔️ ${seedInfo.challengeType==="wild"?"WILD BOARD":"SAME BOARD"} · #${boardTag(seedInfo.seed)}`}
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>
                {seedInfo.kind==="daily"
                  ? "Same board for everyone · no rerolls · one position per player · stats hidden — know your players."
                  : seedInfo.challengeType==="wild"
                    ? "Your own random teams · build the best squad you can · share Board # so scores match up."
                    : "Same teams for both players · no rerolls · share Board # so scores match up."}
              </div>
            </div>
          )}
          {mode==="h2h" && (
            <div style={{ textAlign:"center", marginBottom:12, fontSize:13, color:teamColor, fontWeight:800, letterSpacing:0.5 }}>● DRAFTING TEAM {activeTeam}</div>
          )}

          {/* Lineup slots */}
          <div style={s.card}>
            <div style={s.eyebrow}>{cfg.label==="NFL"?"Starting unit":cfg.label==="NHL"?"Your roster":"Starting lineup"}</div>
            {SLOTS.map(slot => {
              const p = lineup[slot];
              const c1 = p ? p.colors[0] : "#1a1a2a";
              const slotLabel = (cfg.slotBadge && cfg.slotBadge[slot]) || slot.replace(/\d$/,"");
              const slotName = cfg.slotNames && cfg.slotNames[slot];
              return (
                <div key={slot} className="bt-slide" style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", marginBottom:6, borderRadius:14, background: p?`linear-gradient(90deg, ${c1}33, rgba(255,255,255,0.02))`:"rgba(255,255,255,0.03)", border:`1px solid ${p?c1:C.border}` }}>
                  <div style={{ width:46, height:32, borderRadius:9, background: p?c1:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, color:"#fff", flexShrink:0, fontFamily:"'Archivo',sans-serif" }}>{slotLabel}</div>
                  {p ? (
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:14 }}>{p.name}</div>
                      <div style={{ fontSize:10.5, color:C.muted }}>{p.era} {p.team}</div>
                    </div>
                  ) : (
                    <div style={{ flex:1, color:C.dim, fontSize:13 }}>{slotName || "Empty"}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Roll / pick */}
          {!complete && (
            !roll ? (
              <button className="bt-press" style={s.btn()} onClick={doRoll}>🎲 Roll Team &amp; Era</button>
            ) : (
              <div style={{ ...s.card, borderColor:accent, borderWidth:2, background:`linear-gradient(160deg, ${accent}1a, ${C.card} 55%)` }}>
                {/* Team banner */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <div style={{ width:6, height:42, borderRadius:3, background:`linear-gradient(${accent}, ${accent2})` }} />
                  <div>
                    <div style={{ fontFamily:"'Archivo','Inter',sans-serif", fontSize:21, fontWeight:900, letterSpacing:-0.5 }}>{roll.era} {roll.team}</div>
                    <div style={{ fontSize:12, color:C.muted }}>Pick one player — your choice is locked in</div>
                  </div>
                </div>

                {/* Re-rolls (count-based; NFL allows 2 each). Hidden on seeded boards (daily/challenge). */}
                {!seedInfo && (
                <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                  {(() => {
                    const teamUsedUp = reTeam >= cfg.rerolls;
                    const teamLabel = teamUsedUp ? "Team re-rolls used" : `🔄 Re-roll Team${cfg.rerolls>1?` (${cfg.rerolls-reTeam} left)`:""}`;
                    return (
                      <button onClick={doReTeam} disabled={teamUsedUp} style={{ flex:1, padding:"9px", background:teamUsedUp?"#1a1a1a":"#1e1e2e", color:teamUsedUp?C.dim:C.text, border:"1px solid #333", borderRadius:8, fontWeight:700, fontSize:12, cursor:teamUsedUp?"not-allowed":"pointer", opacity:teamUsedUp?0.5:1 }}>{teamLabel}</button>
                    );
                  })()}
                  {(() => {
                    const eraUsedUp = reEra >= cfg.rerolls;
                    const disabled = eraUsedUp || !eraRerollPossible;
                    const eraLabel = eraUsedUp ? "Era re-rolls used" : !eraRerollPossible ? "No other era" : `🔄 Re-roll Era${cfg.rerolls>1?` (${cfg.rerolls-reEra} left)`:""}`;
                    return (
                      <button onClick={doReEra} disabled={disabled} style={{ flex:1, padding:"9px", background:disabled?"#1a1a1a":"#1e1e2e", color:disabled?C.dim:C.text, border:"1px solid #333", borderRadius:8, fontWeight:700, fontSize:12, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1 }}>{eraLabel}</button>
                    );
                  })()}
                </div>
                )}

                {/* Player rows: name on top, stats + draft buttons (per eligible slot) below */}
                {players.map(rawPlayer => {
                  // DAILY CHALLENGE = experts mode: each player has only ONE position
                  // and their stats are hidden, so you draft on knowledge alone.
                  const dailyMode = seedInfo && seedInfo.kind==="daily";
                  const player = dailyMode ? { ...rawPlayer, pos:[ (dailyPos && dailyPos[rawPlayer.name]) || rawPlayer.pos[0] ] } : rawPlayer;
                  // which SLOTS can this player be drafted into?
                  const draftable = SLOTS.filter(slot => playerFitsSlot(player, slot) && canDraftAt(slot));
                  const canPick = draftable.length > 0;
                  const multiSlot = draftable.length > 1;
                  return (
                    <div key={rawPlayer.name} style={{ padding:"11px 13px", borderRadius:14, marginBottom:7, background:"rgba(255,255,255,0.03)", border:`1px solid ${canPick?accent+"55":C.border}`, opacity:canPick?1:0.4 }}>
                      {/* Top line: positions + name */}
                      <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom: dailyMode?0:7 }}>
                        <span style={{ fontSize:14, fontWeight:900, color:accent2==="#000000"||accent2==="#000"?C.gold:accent2, flexShrink:0, letterSpacing:0.3 }}>{player.pos.join("/")}</span>
                        <span style={{ fontWeight:800, fontSize:15, flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{player.name}</span>
                        {dailyMode && canPick && (
                          <div style={{ display:"flex", gap:3, flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                            {draftable.map(slot => {
                              const willMove = !open.includes(slot) && lineup[slot];
                              const slotLabel = (cfg.slotBadge && cfg.slotBadge[slot]) || slot.replace(/\d$/,"")+(/\d$/.test(slot)?slot.slice(-1):"");
                              return (
                                <button key={slot} className="bt-press" onClick={()=>pickPlayer(player,slot)} title={willMove?`Moves ${lineup[slot].name.split(" ").slice(-1)[0]} to an open slot`:""} style={{ padding:"7px 13px", borderRadius:11, fontWeight:800, fontSize:12.5, cursor:"pointer", border:"none", background: willMove?accent2:C.green, color: willMove?"#fff":"#06120c", whiteSpace:"nowrap", boxShadow:"0 3px 10px rgba(0,0,0,0.3)" }}>{multiSlot?slotLabel:"Draft"}{willMove?" ⇄":""}</button>
                              );
                            })}
                          </div>
                        )}
                        {dailyMode && !canPick && (
                          <span style={{ fontSize:10, color:C.dim, fontWeight:700, whiteSpace:"nowrap", flexShrink:0 }}>filled</span>
                        )}
                      </div>
                      {/* Bottom line: stats + draft button (hidden in daily experts mode) */}
                      {!dailyMode && (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                        <StatChips p={player} cats={CATS_S} labels={LABELS_S} accent={accent2==="#000000"||accent2==="#000"?C.gold:accent2} />
                        {canPick ? (
                          <div style={{ display:"flex", gap:3, flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                            {draftable.map(slot => {
                              const willMove = !open.includes(slot) && lineup[slot];
                              const slotLabel = (cfg.slotBadge && cfg.slotBadge[slot]) || slot.replace(/\d$/,"")+(/\d$/.test(slot)?slot.slice(-1):"");
                              return (
                                <button key={slot} className="bt-press" onClick={()=>pickPlayer(player,slot)} title={willMove?`Moves ${lineup[slot].name.split(" ").slice(-1)[0]} to an open slot`:""} style={{ padding:"8px 13px", borderRadius:11, fontWeight:800, fontSize:12.5, cursor:"pointer", border:"none", background: willMove?accent2:C.green, color: willMove?"#fff":"#06120c", whiteSpace:"nowrap", boxShadow:"0 3px 10px rgba(0,0,0,0.3)" }}>{multiSlot?slotLabel:"Draft"}{willMove?" ⇄":""}</button>
                              );
                            })}
                          </div>
                        ) : (
                          <span style={{ fontSize:10, color:C.dim, fontWeight:700, whiteSpace:"nowrap", flexShrink:0 }}>filled</span>
                        )}
                      </div>
                      )}
                    </div>
                  );
                })}
                {players.every(player => !SLOTS.some(slot => playerFitsSlot(player, slot) && canDraftAt(slot))) && (
                  <button style={s.ghost} onClick={()=>setRoll(null)}>No player fits an open slot — roll again</button>
                )}
              </div>
            )
          )}

          {complete && (
            <div style={{ ...s.card, textAlign:"center" }}>
              <div style={{ fontSize:30, marginBottom:6 }}>✅</div>
              <div style={{ fontWeight:800, fontSize:17, marginBottom:4 }}>Lineup Complete</div>
              <div style={{ color:C.muted, fontSize:13, marginBottom:14 }}>{mode==="h2h"&&activeTeam==="A"?"Now draft Team B":"Run the numbers"}</div>
              <button style={s.btn()} onClick={finishDraft}>{mode==="season"?"Project Record →":activeTeam==="A"?"Draft Team B →":"See Who Wins →"}</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── SEASON RESULT ──
  if (screen==="result") {
    const cfg = SPORTS[sport];
    const r = projectRecord(lineupA, cfg);
    const perfect = r.wins===cfg.goal;
    const tierLabel = perfect ? cfg.perfectLabel : (cfg.tiers.find(([min])=>r.wins>=min)||["",""])[1];
    return (
      <ResultReveal perfect={perfect}>
      <div style={s.app}>
      <div style={s.glow} />
        <div style={s.hdr}><div style={{ ...s.logo, cursor:"pointer" }} onClick={goHome} title="Back to home">BEAT <span style={{ color:C.gold }}>THAT</span></div><div style={{ fontSize:13, color:C.muted }}>{cfg.label} · Projected Season</div></div>
        <div style={s.wrap}>
          <div className="bt-pop" style={{ textAlign:"center", padding:"30px 0 16px" }}>
            <div style={{ display:"inline-flex", alignItems:"baseline", gap:14, fontFamily:"'Archivo','Inter',sans-serif", fontSize:72, fontWeight:900, letterSpacing:-3, lineHeight:1 }}>
              <span style={{ color:perfect?C.gold:C.green, textShadow:perfect?`0 0 30px ${C.gold}66`:"none" }}>{r.wins}</span>
              <span style={{ color:C.dim, fontSize:40 }}>–</span>
              <span style={{ color:r.losses===0?C.gold:C.red }}>{r.losses}</span>
            </div>
            <div style={{ color:perfect?C.gold:C.text, fontSize:15, marginTop:10, fontWeight:perfect?900:700, letterSpacing:0.2 }}>{tierLabel}</div>
            <div style={{ display:"inline-block", marginTop:8, padding:"4px 12px", borderRadius:999, background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontWeight:700, letterSpacing:0.5 }}>CHASING {cfg.chase}</div>
          </div>
          {/* Scouting report */}
          <div className="bt-slide" style={{ ...s.card }}>
            <div style={s.eyebrow}>📋 Scouting report</div>
            <p style={{ margin:"0 0 10px", fontSize:14.5, lineHeight:1.55, color:C.text }}>{praiseLine(lineupA, cfg)}</p>
            {!perfect && lossLocationLine(r.wins, cfg, lineupSeed(lineupA)) && (
              <p style={{ margin:"0 0 10px", fontSize:13.5, lineHeight:1.45, color:C.red }}>{lossLocationLine(r.wins, cfg, lineupSeed(lineupA))}</p>
            )}
            <p style={{ margin:0, fontSize:13.5, lineHeight:1.45, color: perfect?C.green:"#ffc861" }}>{seasonGapLine(lineupA, cfg)}</p>
          </div>
          <div style={s.card}>
            <div style={s.eyebrow}>Team report</div>
            {cfg.cats.map(c => {
              const b = r.breakdown[c];
              const tier = perfect ? { label:"Elite", color:"#FFCB45", glow:true, cleared:true } : catTier(b.ratio);
              return (
                <div key={c} style={{ ...s.row, padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <span style={{ width:11, height:11, borderRadius:"50%", background:tier.color, boxShadow:tier.glow?`0 0 10px ${tier.color}`:"none", flexShrink:0 }} />
                    <span style={{ fontWeight:800, letterSpacing:0.3, fontSize:14 }}>{cfg.catLabel[c]}</span>
                  </div>
                  <span style={{ color:tier.color, fontWeight:800, fontSize:13.5, letterSpacing:0.3 }}>{tier.label}</span>
                </div>
              );
            })}
            <div style={{ fontSize:11.5, color:C.dim, marginTop:12, lineHeight:1.5 }}>
              {perfect
                ? `Every part of your team is firing. That's how you ${cfg.chase==="82-0"?"go 82-0":"run the table"}.`
                : `Read the scouting report above for where you're strong and where the gaps are. Tighten the weak spots and try again.`}
            </div>
          </div>
          <div style={s.card}>
            <div style={s.eyebrow}>Your {cfg.label==="NFL"?"unit":"lineup"}</div>
            {cfg.positions.map(slot => {
              const p = lineupA[slot]; if (!p) return null;
              const slotLabel = (cfg.slotBadge && cfg.slotBadge[slot]) || slot.replace(/(\d)$/," $1");
              return (
                <div key={slot} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ width:42, height:28, borderRadius:7, background:p.colors[0], display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:10.5, color:"#fff", flexShrink:0 }}>{slotLabel}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:13.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name} <span style={{ fontSize:10, color:C.dim, fontWeight:500 }}>{p.era} {p.team}</span></div>
                  </div>
                  <StatChips p={p} cats={cfg.cats} labels={cfg.catLabel} accent={C.text} />
                </div>
              );
            })}
          </div>
          <ResultActions
            cfg={cfg} r={r} perfect={perfect} tierLabel={tierLabel}
            lineupA={lineupA} teamName={teamNameA} saveTeamName={saveTeamName}
            seedInfo={seedInfo} stats={stats} recordResult={recordResult}
            showToast={showToast} reset={reset}
          />
        </div>
      </div>
      </ResultReveal>
    );
  }

  // ── HEAD-TO-HEAD RESULT ──
  if (screen==="h2h_result") {
    const cfgH = SPORTS[sport];
    const h = headToHead(lineupA, lineupB, cfgH);
    const winnerName = h.winner==="A"?"Team A":h.winner==="B"?"Team B":"Tie";
    return (
      <div style={s.app}>
      <div style={s.glow} />
        <div style={s.hdr}><div style={{ ...s.logo, cursor:"pointer" }} onClick={goHome} title="Back to home">BEAT <span style={{ color:C.gold }}>THAT</span></div><div style={{ fontSize:13, color:C.muted }}>{cfgH.label} · Head-to-Head</div></div>
        <div style={s.wrap}>
          <div style={{ textAlign:"center", padding:"24px 0 12px" }}>
            <div style={{ fontSize:30, fontWeight:900 }}><span style={{ color:C.green }}>{h.aWins}</span><span style={{ color:C.muted, fontSize:18 }}> categories </span><span style={{ color:C.blue }}>{h.bWins}</span></div>
            <div style={{ fontSize:22, fontWeight:800, marginTop:8, color:h.winner==="A"?C.green:h.winner==="B"?C.blue:C.muted }}>{h.winner==="T"?"Dead Heat!":`${winnerName} Wins 🏆`}</div>
          </div>
          {/* Matchup scouting reports */}
          <div style={{ ...s.card, background:"linear-gradient(160deg, #16161f, #0e0e16)", borderColor:"#2a2a3a" }}>
            <div style={{ ...s.eyebrow, color:C.green }}>📋 TEAM A</div>
            <p style={{ margin:"0 0 8px", fontSize:13.5, lineHeight:1.45, color:C.text }}>{praiseLine(lineupA, cfgH)}</p>
            <p style={{ margin:"0 0 16px", fontSize:13, lineHeight:1.4, color:"#ffb84d" }}>{h2hAnalysisLine(lineupA, lineupB, "Team A", cfgH)}</p>
            <div style={{ ...s.eyebrow, color:C.blue }}>📋 TEAM B</div>
            <p style={{ margin:"0 0 8px", fontSize:13.5, lineHeight:1.45, color:C.text }}>{praiseLine(lineupB, cfgH)}</p>
            <p style={{ margin:0, fontSize:13, lineHeight:1.4, color:"#ffb84d" }}>{h2hAnalysisLine(lineupB, lineupA, "Team B", cfgH)}</p>
          </div>
          <div style={s.card}>
            <div style={s.eyebrow}>CATEGORY MATCHUP</div>
            <div style={{ ...s.row, fontSize:11, color:C.muted, fontWeight:700, paddingBottom:7, borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.green, flex:1 }}>TEAM A</span><span style={{ width:50, textAlign:"center" }}>CAT</span><span style={{ color:C.blue, flex:1, textAlign:"right" }}>TEAM B</span>
            </div>
            {h.rows.map(row => (
              <div key={row.cat} style={{ ...s.row, padding:"11px 0", borderBottom:`1px solid #15151f` }}>
                <span style={{ flex:1, fontWeight:800, fontSize:17, color:row.winner==="A"?C.green:C.text }}>{row.a}{row.winner==="A"?" ◄":""}</span>
                <span style={{ width:50, textAlign:"center", fontSize:11, color:C.muted, fontWeight:700 }}>{cfgH.catLabel[row.cat]}</span>
                <span style={{ flex:1, textAlign:"right", fontWeight:800, fontSize:17, color:row.winner==="B"?C.blue:C.text }}>{row.winner==="B"?"► ":""}{row.b}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {["A","B"].map(team => {
              const lu = team==="A"?lineupA:lineupB;
              return (
                <div key={team} style={{ ...s.card, flex:1, marginBottom:0 }}>
                  <div style={{ ...s.eyebrow, color:team==="A"?C.green:C.blue }}>TEAM {team}</div>
                  {cfgH.positions.map(slot => { const p=lu[slot]; if(!p) return null;
                    return <div key={slot} style={{ fontSize:11.5, padding:"4px 0" }}><span style={{ color:C.muted, marginRight:5, fontWeight:700 }}>{slot}</span>{p.name.split(" ").slice(-1)[0]}</div>;
                  })}
                </div>
              );
            })}
          </div>
          <button style={s.btn()} onClick={reset}>Play Again</button>
        </div>
      </div>
    );
  }
  return null;
}
