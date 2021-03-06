(function(angular){
  'use strict';

  var obj = {
	arr_geo_region: [{
	  "city": 1,
	  "stations":[[251,"Берёзовая роща"],[241,"Гагаринская"],[240,"Заельцовская"],[852,"Золотая нива"],[242,"Красный проспект"],[250,"Маршала Покрышкина"],[244,"Октябрьская"],[248,"Площадь Гарина-Михайловского"],[243,"Площадь Ленина"],[247,"Площадь Маркса"],[245,"Речной вокзал"],[249,"Сибирская"],[246,"Студенческая"]],
	  "districts":[[151,"Дзержинский"],[152,"Железнодорожный"],[150,"Заельцовский"],[153,"Калининский"],[154,"Кировский"],[155,"Ленинский"],[156,"Октябрьский"],[157,"Первомайский"],[158,"Советский"],[159,"Центральный"]]
	},{
	  "city": 2,
	  "stations":[],
	  "districts":[[263,"Кировский"],[264,"Ленинский"],[265,"Октябрьский"],[266,"Советский"],[267,"Центральный"]]
	},{
	  "city": 3,
	  "stations":[],
	  "districts":[[313,"Кировский"],[315,"Ленинский"],[314,"Октябрьский"],[316,"Советский"]]
	},{
	  "city":4,
	  "stations":[],
	  "districts":[[399,"Железнодорожный"],[402,"Индустриальный"],[400,"Ленинский"],[403,"Октябрьский"],[401,"Центральный"]]
	},{
	  "city":5,
	  "stations":[],
	  "districts":[[323,"Заводский"],[326,"Кировский"],[324,"Ленинский"],[327,"Рудничный"],[325,"Центральный"]]
	},{
	  "city":6,
	  "stations":[],
	  "districts":[[429,"Заводской"],[432,"Кузнецкий"],[430,"Куйбышевский"],[433,"Новоильинский"],[431,"Орджоникидзевский"],[434,"Центральный"]]
	},{
	  "city":7,
	  "stations":[],
	  "districts":[[206,"Железнодорожный"],[200,"Кировский"],[201,"Ленинский"],[202,"Октябрьский"],[204,"Свердловский"],[203,"Советский"],[205,"Центральный"]]
	},{
	  "city":8,
	  "stations":[],
	  "districts":[[388,"Кировский"],[390,"Ленинский"],[389,"Советский"],[391,"Трусовский"]]
	},{
	  "city": 9,
	  "stations":[[1775,"Ботаническая"],[266,"Геологическая"],[264,"Динамо"],[262,"Машиностроителей"],[265,"Площадь 1905 года"],[260,"Проспект Космонавтов"],[261,"Уралмаш"],[263,"Уральская"],[2954,"Чкаловская"]],
	  "districts":[[146,"Верх-Исетский"],[149,"Железнодорожный"],[147,"Кировский"],[145,"Ленинский"],[148,"Октябрьский"],[143,"Орджоникидзевский"],[144,"Чкаловский"]]
	},{
	  "city":11,
	  "stations":[],
	  "districts":[[601,"Ершовский"],[271,"Ленинский"],[273,"Октябрьский"],[272,"Правобережный"],[274,"Свердловский"]]
	},{
	  "city": 15,
	  "stations":[],
	  "districts":[[219,"Калининский"],[220,"Курчатовский"],[221,"Ленинский"],[222,"Металлургический"],[223,"Советский"],[224,"Тракторозаводский"],[225,"Центральный"]]
	},{
	  "city": 19,
	  "stations":[[229,"Автозаводская"],[239,"Буревестник"],[238,"Бурнаковская"],[3565,"Горьковская"],[231,"Двигатель Революции"],[232,"Заречная"],[237,"Канавинская"],[227,"Кировская"],[228,"Комсомольская"],[233,"Ленинская"],[235,"Московская"],[226,"Парк Культуры"],[230,"Пролетарская"],[234,"Чкаловская"]],
	  "districts":[[170,"Автозаводский"],[171,"Канавинский"],[172,"Ленинский"],[173,"Московский"],[174,"Нижегородский"],[175,"Приокский"],[176,"Советский"],[177,"Сормовский"]]
	},{
	  "city": 21,
	  "stations":[[3850,"Авиастроительная"],[270,"Аметьево"],[271,"Горки"],[850,"Козья слобода"],[267,"Кремлёвская"],[268,"Площадь Габдуллы Тукая"],[620,"Проспект Победы"],[3851,"Северный вокзал"],[269,"Суконная слобода"],[3852,"Яшьлек"]],
	  "districts":[[178,"Авиастроительный"],[179,"Вахитовский"],[180,"Кировский"],[181,"Московский"],[182,"Ново-Савиновский"],[183,"Приволжский"],[184,"Советский"]]
	},{
	  "city": 23,
	  "stations":[],
	  "districts":[[212,"Западный"],[214,"Карасунский"],[213,"Прикубанский"],[215,"Центральный"]]
	},{
	  "city":32,
	  "stations":[[1,"Авиамоторная"],[2,"Автозаводская"],[3,"Академическая"],[4,"Александровский сад"],[5,"Алексеевская"],[3569,"Алма-Атинская"],[6,"Алтуфьево"],[7,"Аннино"],[8,"Арбатская"],[9,"Аэропорт"],[10,"Бабушкинская"],[11,"Багратионовская"],[12,"Баррикадная"],[13,"Бауманская"],[14,"Беговая"],[15,"Белорусская"],[16,"Беляево"],[17,"Бибирево"],[18,"Библиотека имени Ленина"],[20,"Борисово"],[21,"Боровицкая"],[22,"Ботанический сад"],[23,"Братиславская"],[24,"Бульвар адмирала Ушакова"],[25,"Бульвар Дмитрия Донского"],[145,"Бульвар Рокоссовского"],[26,"Бунинская аллея"],[27,"Варшавская"],[28,"ВДНХ"],[29,"Владыкино"],[30,"Водный стадион"],[31,"Войковская"],[32,"Волгоградский проспект"],[33,"Волжская"],[34,"Волоколамская"],[35,"Воробьёвы горы"],[38,"Выставочная"],[36,"Выставочный центр (монорельс)"],[37,"Выхино"],[39,"Динамо"],[40,"Дмитровская"],[41,"Добрынинская"],[42,"Домодедовская"],[2247,"Достоевская"],[43,"Дубровка"],[4511,"Жулебино"],[1946,"Зябликово"],[44,"Измайловская"],[46,"Калужская"],[47,"Кантемировская"],[48,"Каховская"],[49,"Каширская"],[50,"Киевская"],[51,"Китай-город"],[52,"Кожуховская"],[53,"Коломенская"],[54,"Комсомольская"],[55,"Коньково"],[487,"Красногвардейская"],[56,"Краснопресненская"],[57,"Красносельская"],[58,"Красные ворота"],[59,"Крестьянская застава"],[60,"Кропоткинская"],[61,"Крылатское"],[62,"Кузнецкий мост"],[63,"Кузьминки"],[64,"Кунцевская"],[65,"Курская"],[66,"Кутузовская"],[67,"Ленинский проспект"],[4512,"Лермонтовский проспект"],[68,"Лубянка"],[69,"Люблино"],[70,"Марксистская"],[71,"Марьина роща"],[72,"Марьино"],[73,"Маяковская"],[74,"Медведково"],[75,"Международная"],[76,"Менделеевская"],[648,"Митино"],[77,"Молодёжная"],[650,"Мякинино"],[78,"Нагатинская"],[79,"Нагорная"],[80,"Нахимовский проспект"],[81,"Новогиреево"],[3562,"Новокосино"],[82,"Новокузнецкая"],[83,"Новослободская"],[19,"Новоясеневская"],[84,"Новые Черёмушки"],[85,"Октябрьская"],[86,"Октябрьское поле"],[87,"Орехово"],[88,"Отрадное"],[89,"Охотный ряд"],[90,"Павелецкая"],[91,"Парк культуры"],[92,"Парк Победы"],[93,"Партизанская"],[94,"Первомайская"],[95,"Перово"],[96,"Петровско-Разумовская"],[97,"Печатники"],[98,"Пионерская"],[99,"Планерная"],[101,"Площадь Ильича"],[102,"Площадь Революции"],[103,"Полежаевская"],[104,"Полянка"],[105,"Пражская"],[106,"Преображенская площадь"],[107,"Пролетарская"],[108,"Проспект Вернадского"],[109,"Проспект Мира"],[488,"Профсоюзная"],[110,"Пушкинская"],[3568,"Пятницкое шоссе"],[111,"Речной вокзал"],[112,"Рижская"],[113,"Римская"],[114,"Рязанский проспект"],[115,"Савёловская"],[116,"Свиблово"],[117,"Севастопольская"],[118,"Семёновская"],[119,"Серпуховская"],[626,"Славянский бульвар"],[120,"Смоленская"],[121,"Сокол"],[122,"Сокольники"],[123,"Спортивная"],[489,"Строгино"],[124,"Студенческая"],[125,"Сухаревская"],[126,"Сходненская"],[127,"Таганская"],[128,"Тверская"],[129,"Театральная"],[130,"Текстильщики"],[131,"Телецентр (монорельс)"],[132,"Тёплый Стан"],[133,"Тимирязевская"],[134,"Тимирязевская (монорельс)"],[135,"Третьяковская"],[4516,"Тропарёво"],[136,"Трубная"],[137,"Тульская"],[138,"Тургеневская"],[139,"Тушинская"],[140,"Улица 1905 года"],[141,"Улица Академика Королёва (монорельс)"],[142,"Улица Академика Янгеля"],[143,"Улица Горчакова"],[144,"Улица Милашенкова (монорельс)"],[146,"Улица Сергея Эйзенштейна (монорельс)"],[147,"Улица Скобелевская"],[148,"Улица Старокачаловская"],[149,"Университет"],[150,"Филёвский парк"],[151,"Фили"],[152,"Фрунзенская"],[153,"Царицыно"],[154,"Цветной бульвар"],[155,"Черкизовская"],[156,"Чертановская"],[157,"Чеховская"],[158,"Чистые пруды"],[159,"Чкаловская"],[160,"Шаболовская"],[1945,"Шипиловская"],[161,"Шоссе Энтузиастов"],[162,"Щёлковская"],[163,"Щукинская"],[164,"Электрозаводская"],[165,"Юго-Западная"],[166,"Южная"],[167,"Ясенево "]],
	  "districts":[[89,"Академический"],[28,"Алексеевский"],[29,"Алтуфьевский"],[2,"Арбат"],[12,"Аэропорт"],[30,"Бабушкинский"],[3,"Басманный"],[13,"Беговой"],[14,"Бескудниковский"],[31,"Бибирево"],[73,"Бирюлёво Восточное"],[74,"Бирюлёво Западное"],[45,"Богородское"],[75,"Братеево"],[32,"Бутырский"],[46,"Вешняки"],[101,"Внуково"],[15,"Войковский"],[16,"Восточное Дегунино"],[48,"Восточное Измайлово"],[47,"Восточный"],[61,"Выхино-Жулебино"],[90,"Гагаринский"],[17,"Головинский"],[49,"Гольяново"],[76,"Даниловский"],[18,"Дмитровский"],[77,"Донской"],[102,"Дорогомилово"],[4,"Замоскворечье"],[19,"Западное Дегунино"],[91,"Зюзино"],[78,"Зябликово"],[50,"Ивановское"],[51,"Измайлово"],[62,"Капотня"],[565,"Кожухово"],[92,"Коньково"],[20,"Коптево"],[52,"Косино-Ухтомский"],[93,"Котловка"],[5,"Красносельский"],[103,"Крылатское"],[124,"Крюково"],[63,"Кузьминки"],[104,"Кунцево"],[114,"Куркино"],[21,"Левобережный"],[64,"Лефортово"],[33,"Лианозово"],[94,"Ломоносовский"],[34,"Лосиноостровский"],[65,"Люблино"],[35,"Марфино"],[36,"Марьина Роща"],[66,"Марьино"],[122,"Матушкино"],[53,"Метрогородок"],[6,"Мещанский"],[115,"Митино"],[105,"Можайский"],[22,"Молжаниновский"],[79,"Москворечье-Сабурово"],[81,"Нагатино-Садовники"],[80,"Нагатинский Затон"],[82,"Нагорный"],[67,"Некрасовка"],[68,"Нижегородский"],[106,"Ново-Переделкино"],[54,"Новогиреево"],[55,"Новокосино"],[95,"Обручевский"],[83,"Орехово-Борисово"],[84,"Орехово-Борисово Южное"],[37,"Останкинский"],[38,"Отрадное"],[107,"Очаково-Матвеевское"],[123,"Панфиловский"],[56,"Перово"],[69,"Печатники"],[116,"Покровское-Стрешнево"],[57,"Преображенское"],[7,"Пресненский"],[108,"Проспект Вернадского"],[109,"Раменки"],[39,"Ростокино"],[70,"Рязанский"],[4381,"Савёлки"],[23,"Савёловский"],[40,"Свиблово"],[96,"Северное Бутово"],[58,"Северное Измайлово"],[42,"Северное Медведково"],[117,"Северное Тушино"],[41,"Северный"],[24,"Сокол"],[59,"Соколиная Гора"],[60,"Сокольники"],[110,"Солнцево"],[118,"Строгино"],[8,"Таганский"],[9,"Тверской"],[71,"Текстильщики"],[97,"Тёплый Стан"],[25,"Тимирязевский"],[111,"Тропарёво-Никулино"],[112,"Филёвский Парк"],[113,"Фили-Давыдково"],[10,"Хамовники"],[26,"Ховрино"],[27,"Хорошевский"],[119,"Хорошёво-Мнёвники"],[88,"Царицыно"],[98,"Черёмушки"],[85,"Чертаново Северное"],[86,"Чертаново Центральное"],[87,"Чертаново Южное"],[120,"Щукино"],[99,"Южное Бутово"],[43,"Южное Медведково"],[121,"Южное Тушино"],[72,"Южнопортовый"],[11,"Якиманка"],[44,"Ярославский"],[100,"Ясенево"]]
	},{
	  "city": 38,
	  "stations": [[184,"Автово"],[652,"Адмиралтейская"],[170,"Академическая"],[181,"Балтийская"],[653,"Бухарестская"],[205,"Василеостровская"],[178,"Владимирская"],[492,"Волковская"],[174,"Выборгская"],[194,"Горьковская"],[206,"Гостиный двор"],[169,"Гражданский проспект"],[168,"Девяткино"],[220,"Достоевская"],[209,"Елизаровская"],[493,"Звенигородская"],[202,"Звёздная"],[183,"Кировский завод"],[214,"Комендантский проспект"],[216,"Крестовский остров"],[203,"Купчино"],[223,"Ладожская"],[185,"Ленинский проспект"],[173,"Лесная"],[221,"Лиговский проспект"],[210,"Ломоносовская"],[207,"Маяковская"],[654,"Международная"],[201,"Московская"],[198,"Московские ворота"],[182,"Нарвская"],[195,"Невский проспект"],[222,"Новочеркасская"],[651,"Обводный канал"],[212,"Обухово"],[189,"Озерки"],[200,"Парк Победы"],[187,"Парнас"],[193,"Петроградская"],[191,"Пионерская"],[208,"Площадь Александра Невского"],[177,"Площадь Восстания"],[175,"Площадь Ленина"],[172,"Площадь Мужества"],[171,"Политехническая"],[204,"Приморская"],[211,"Пролетарская"],[224,"Проспект Большевиков"],[186,"Проспект Ветеранов"],[188,"Проспект Просвещения"],[179,"Пушкинская"],[213,"Рыбацкое"],[219,"Садовая"],[196,"Сенная площадь"],[619,"Спасская"],[218,"Спортивная"],[215,"Старая Деревня"],[180,"Технологический институт"],[190,"Удельная"],[225,"Улица Дыбенко "],[197,"Фрунзенская"],[176,"Чернышевская"],[192,"Чёрная речка"],[217,"Чкаловская"],[199,"Электросила"]],
	  "districts":[[125,"Адмиралтейский"],[126,"Василеостровский"],[127,"Выборгский"],[128,"Калининский"],[129,"Кировский"],[130,"Колпинский"],[131,"Красногвардейский"],[132,"Красносельский"],[133,"Кронштадтский"],[134,"Курортный"],[135,"Московский"],[136,"Невский"],[137,"Петроградский"],[138,"Петродворцовый"],[139,"Приморский"],[140,"Пушкинский"],[141,"Фрунзенский"],[142,"Центральный"]]
	},{
	  "city":46,
	  "stations":[],
	  "districts":[[318,"Восточный"],[319,"Западный"]]
	},{
	  "city":49,
	  "stations":[],
	  "districts":[[249,"Варавино-Фактория"],[252,"Исакогорский"],[255,"Ломоносовский"],[250,"Маймаксанский"],[253,"Майская Горка"],[256,"Октябрьский"],[251,"Северный"],[254,"Соломбальский"],[257,"Цигломенский"]]
	},{
	  "city":67,
	  "stations":[[1779,"Абай"],[1782,"Алатау"],[1778,"Алмалы"],[1780,"Байконур"],[1777,"Жибек Жолы"],[4518,"Москва"],[1776,"Райымбек батыр"],[4519,"Сайран"],[1781,"Театр имени Мухтара Ауэзова"]],
	  "districts":[[4451,"Алатауский"],[543,"Алмалинский"],[544,"Ауэзовский"],[545,"Бостандыкский"],[546,"Жетысуский"],[547,"Медеуский"],[4452,"Наурызбайский"],[548,"Турксибский"]]
	}]
  };
  
  angular.module('myApp.ArrGeoRegion', [])
	.value('ArrGeoRegion', obj);
  
})(window.angular);
