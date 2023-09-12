import { useEffect, useState } from 'react';
import './style.scss';
import { Collection } from './components/Collection.jsx';

const categories = [
  {
    name: 'Все',
  },
  {
    name: 'Море',
  },
  {
    name: 'Горы',
  },
  {
    name: 'Архитектура',
  },
  {
    name: 'Города',
  },
];

function App() {
  const [collections, setCollections] = useState([]); // Стейт для коллекций
  const [searchValue, setSearchValue] = useState(''); // Стейт для инпута
  const [categoryId, setCategoryId] = useState(0); // Стейт для фильтрации по айдишнику + заппросы с бэка
  const [isLoading, setIsLoading] = useState(true); // Стейт для отображения пользователю информации во время перерендера категорий
  const [page, setPage] = useState(1); // Стейт для пагинации

  // Запрашиваем данные с сервера и храним их в состоянии
  useEffect(() => {
    // Это для корректного отображения сообщения о загрузке данных во время переключения фильтров
    setIsLoading(true);

    const category = categoryId ? `category=${categoryId}` : ' ';

    fetch(
      // Тут проверяем категории для фильтрации + лимит отображаемых категорий для пагинации
      `https://64feeebff8b9eeca9e294f18.mockapi.io/photos-collections?page=${page}&limit=3&${category}`
    )
      .then((res) => res.json())
      .then((json) => {
        setCollections(json);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении данных');
      })
      // .finally() для отображения данных после прогрузки страницы
      .finally(() => setIsLoading(false));
    // В массиве реализуем отрисовку отфильтрованных данных, получая их от сервера
  }, [categoryId, page]);
  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {/* // Делаем отрисовку категорий */}
          {categories.map((obj, ind) => (
            <li
              // Меняем класс категории при клике на неё
              onClick={() => setCategoryId(ind)}
              className={categoryId === ind ? 'active' : ''}
              key={obj.name}
            >
              {obj.name}
            </li>
          ))}
        </ul>
        {/* Делаем контролируемый инпут через useState() для поиска */}
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {/* Проверяем, если идёт загрузка данных, то отображаем информацию о загрузке, иначе отображаем данные */}
        {isLoading ? (
          <h2> Идёт загрузка данных ...</h2>
        ) : (
          collections
            // Прежде чем отрисовать коллекции(карточки), мы их фильтруем на содержание вводимых символов в инпут
            .filter((obj) =>
              obj.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((obj) => (
              <Collection name={obj.name} images={obj.photos} key={obj.id} />
            ))
        )}
      </div>
      <ul className="pagination">
        {/* Функционал пагинации */}
        {[...Array(5)].map((_, ind) => (
          <li
            onClick={() => setPage(ind + 1)}
            className={page === ind + 1 ? 'active' : ' '}
            key={ind}
          >
            {ind + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
