import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    // categoryOptions,
    // ratingsList,
    searchFilterChange,
    searchInputValue,
    onClickChangeCategoryId,
    clearAllFilter,
    enterSearchInput,
  } = props
  //   const {categoryId} = categoryOptions
  const onChangeSearchInput = event => {
    searchFilterChange(event.target.value)
  }

  const onEnterKeyDown = event => {
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const renderCategoryList = () => {
    const {
      categoryOptions,
      //   ratingsList,
      activeCategoryId,
      //   activeRatingId,
    } = props
    return (
      <ul className="category-item-container">
        {categoryOptions.map(eachItem => {
          const onClickGetCategoryId = () => {
            onClickChangeCategoryId(eachItem.categoryId)
          }
          const isTrue = eachItem.categoryId === activeCategoryId
          const categoryClassName = isTrue ? 'active-category' : ''
          return (
            <li
              className="category-item"
              key={eachItem.categoryId}
              onClick={onClickGetCategoryId}
            >
              <p className={categoryClassName}>{eachItem.name}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderRatingList = () => {
    const {ratingsList, activeRatingId, onClickChangeRatingId} = props
    return (
      <ul className="rating-item-container">
        {ratingsList.map(eachRating => {
          const onClickGetRatingId = () => {
            onClickChangeRatingId(eachRating.ratingId)
          }
          const isTrue = eachRating.ratingId === activeRatingId
          const ratingClassName = isTrue ? 'active-rating' : ''
          return (
            <li
              className={`rating-item ${ratingClassName}`}
              key={eachRating.ratingId}
              onClick={onClickGetRatingId}
            >
              <p className="rating-btn">
                <img
                  src={eachRating.imageUrl}
                  alt={`rating ${eachRating.ratingId}`}
                  className="rating-btn-img"
                />
                & up
              </p>
            </li>
          )
        })}
      </ul>
    )
  }

  const onClickClearFilter = () => {
    clearAllFilter()
  }

  return (
    <div className="filters-group-container">
      <div className="filter-search-box">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          value={searchInputValue}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterKeyDown}
        />
        <BsSearch />
      </div>
      <div>
        <h3>Category</h3>
        {renderCategoryList()}

        <h3>Rating</h3>
        {renderRatingList()}

        <button
          type="button"
          className="clear-filers"
          onClick={onClickClearFilter}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersGroup
