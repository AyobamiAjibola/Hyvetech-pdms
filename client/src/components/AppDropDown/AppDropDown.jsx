import React, { useState, useEffect } from 'react'
import down from '../../assets/images/caret-down-solid.svg'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import { getExpenseCategories } from '../../store/actions/expenseAction'
import styles from './AppDropDown.module.css'

const AppDropDown = ({ selected, setSelected }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const store = useAppSelector(state => state.expenseReducer);

    const handleOpen = () => {
        setOpen(!open)
    }

    const onOptionClicked = value => () => {
        setSelected(value);
        setOpen(false);
    };

    useEffect(() => {
        dispatch(getExpenseCategories());
      }, []);

    return (
        <>
            {/* <div styles={{backgroundColor: 'yellow', width: '8px', height: '4px'}}> */}
            <p
                style={{
                    backgroundColor: 'white',
                    width: '7rem',
                    marginBottom: '-0.58rem',
                    marginLeft: '8px',
                    paddingLeft: '3px',
                    zIndex: 1,
                    position: 'relative',
                    left: '0px',
                    top: '0px',
                    fontSize: '12px',
                    textAlign: 'center'
                }}
            >Expense Category</p>
            {/* </div> */}
            <div className={styles.dropDown}>
                <button className={styles.dropDownBtn} onClick={handleOpen} type="button">
                    <div className={styles.dropDownText}>
                        <div className={styles.dropDownTitle} style={{ fontSize: '1rem' }}>{selected}</div>
                        <div>
                            <img src={down} alt="" style={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: "all 0.25s" }} />
                        </div>
                    </div>
                </button>
                {open &&
                    <ul className={styles.menu}>
                        {store.expenseCategories.map (data => (
                        <li onClick={onOptionClicked(data.name)} key={data.id}>
                            <button className={styles.menuItemBtnSelect} onClick={handleOpen}>{data.name}</button>
                        </li>
                        ))}
                    </ul>
                }

            </div>
        </>
    )
}

export default AppDropDown