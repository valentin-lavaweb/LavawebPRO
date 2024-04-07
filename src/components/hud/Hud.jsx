import { forwardRef, useEffect, useRef, useState } from "react"
import styles from './styles.module.scss'
import { useStore } from "../../store"
import { CSSTransition } from "react-transition-group"
import { motion } from "framer-motion"
import { texts } from "./texts.jsx"
import GlitchText from "./GlitchText.jsx"

function changeDarkFilter(activeMenu, setActiveMenu) {
    activeMenu.current = !activeMenu.current
    setActiveMenu(activeMenu.current)
}

export default forwardRef(function Hud(props, ref) {
    const [activeMenu, setActiveMenu] = useState(props.activeMenu.current)
    const [language, setLanguage] = useState(props.language.current)
    const [hoveredElement, setHoveredElement] = useState('')
    const [transition, setTransition] = useState(false)
    const nodeRef = useRef()
    const nodeRef2 = useRef()
    const liArray =  [
        {
            ru: 'Главная',
            en: 'Main'
        },
        {
            ru: 'Портфолио',
            en: 'Portfolio'
        },
        {
            ru: 'Услуги',
            en: 'Services'
        },
        {
            ru: 'Контакты',
            en: 'Contacts'
        },
    ]
    const menuText = {
        ru: "Меню",
        en: "Menu"
    }
    
    useEffect(() => {
        setActiveMenu(props.activeMenu.current)
        setLanguage(props.language.current)
    }, [])

    useEffect(() => {
        setTransition(true)
        setTimeout(() => {
            setTransition(false)
        }, 1500);
    }, [language])
    
    return <>
    <CSSTransition nodeRef={nodeRef} in={activeMenu} timeout={2000} 
    onEntered={() => {
        props.activeSceneMenu.current = true
    }}
    onExited={() => {
        props.activeSceneMenu.current = false
    }}
    classNames={{
        appear: styles.appear,
        appearActive: styles.appearActive,
        appearDone: styles.appearDone,
        enter: styles.enter,
        enterActive: styles.enterActive,
        enterDone: styles.enterDone,
        exit: styles.exit,
        exitActive: styles.exitActive,
        exitDone: styles.exitDone,
    }}>
        <div ref={nodeRef} className={styles.darkFilter} />
    </CSSTransition>

    <CSSTransition nodeRef={nodeRef2} in={activeMenu} timeout={500}
    classNames={{
        appear: styles.appear,
        appearActive: styles.appearActive,
        appearDone: styles.appearDone,
        enter: styles.enter,
        enterActive: styles.enterActive,
        enterDone: styles.enterDone,
        exit: styles.exit,
        exitActive: styles.exitActive,
        exitDone: styles.exitDone,
    }}>
        <div className={`${styles.header}`} ref={nodeRef2}
        onClick={() => {changeDarkFilter(props.activeMenu, setActiveMenu)}}
        onPointerEnter={() => {
            setHoveredElement('menu')
        }}
        onPointerLeave={() => {
            setHoveredElement('')
        }}
>           <GlitchText mainStyle={styles.headerText} instant={true} hover={false} textLines={0}
            hoveredElement={hoveredElement} setHoveredElement={setHoveredElement} language={language} transition={transition}
            text={menuText}
            elementToHover={`menu`}
            elementName={`menu`} duration={0.3} delay={0.1}
            />

            <div className={styles.headerLines}>
                <div className={styles.line}/>
                <div className={styles.line}/>
                <div className={styles.line}/>
            </div>
            <div className={styles.headerCross}>
                <div className={styles.crossLine} />
                <div className={styles.crossLine} />
                <div className={styles.crossLine} />
            </div>
        </div>
    </CSSTransition>
    <div className={`${styles.headerMenu} ${activeMenu && styles.active}`}>
        <div className={styles.headerMenuUl}>
            {liArray.map((li, liIndex) => {
                return <GlitchText mainStyle={styles.li} instant={false} hover={true} textLines={0} key={`li ${liIndex}`}
                hoveredElement={hoveredElement} setHoveredElement={setHoveredElement} language={language} transition={transition}
                text={li}
                elementToHover={liIndex}
                elementName={`hoveredLi${liIndex}`} duration={0.3} delay={0.1}
                />
            })}
        </div>
    </div>
    <div className={styles.bottomHud}>
        <div className={styles.leftPanel}>
            <div className={styles.logoBlock}>
                <div className={styles.logoImage}>
                    <img src="/images/logo.png" alt="Lavaweb logo" />
                </div>
                <GlitchText mainStyle={styles.logoText} instant={true} hover={false} textLines={2}
                hoveredElement={hoveredElement} setHoveredElement={setHoveredElement} language={language} transition={transition}
                text={texts.companyDescription}
                elementToHover={null}
                elementName={``} duration={0.1} delay={0.01}
                />
            </div>
        </div>
        <div className={`${styles.rightPanel} ${activeMenu && styles.active}`}>
            <div className={styles.socialsBlock}>
                <div className={styles.socialLi}>Behance</div>
                <div className={styles.socialLi}>TG group</div>
            </div>
            <div className={styles.languagePanel}>
                <div className={`${styles.lang} ${language === 'RU' && styles.active}`} onClick={() => {
                    props.language.current = 'RU'
                    setLanguage(props.language.current)
                }}>RU</div>
                <div className={styles.separator} />
                <div className={`${styles.lang} ${language === 'EN' && styles.active}`} onClick={() => {
                    props.language.current = 'EN'
                    setLanguage(props.language.current)
                }}>EN</div>
            </div>
        </div>
    </div>
    </>
})