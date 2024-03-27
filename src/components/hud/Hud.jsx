import { forwardRef, useEffect, useRef, useState } from "react"
import styles from './styles.module.scss'
import { useStore } from "../../store"
import { CSSTransition } from "react-transition-group"
import { motion } from "framer-motion"
import { texts } from "./texts.jsx"

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
    const spanParentRefs = useRef([])
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
        ru: "Menu",
        en: "Menu"
    }
    function chooseLetters(letter, elementName, i, duration, delay) {
        const animations = {
            first: {
                hover: i => ({
                    opacity: [null, 0, 0, 0],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
                notHover: i => ({
                    opacity: [null, 0, 0, 1],
                    transition: {
                        duration: duration * 0.65,
                        delay: i * delay * 0.65,
                    },
                }),
                transition: i => ({
                    opacity: [null, 0, 0, 0],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
            },
            span1: { 
                hover: i => ({
                    opacity: [0, 1, 0, 0],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
                notHover: i => ({
                    opacity: [0, 0, 1, 0],
                    transition: {
                        duration: duration * 0.65,
                        delay: i * delay * 0.65,
                    },
                }),
                transition: i => ({
                    opacity: [null, 1, 0, 0],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
            },
            span2: {
                hover: i => ({
                    opacity: [0, 0, 1, 0],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
                notHover: i => ({
                    opacity: [0, 1, 0, 0],
                    transition: {
                        duration: duration * 0.65,
                        delay: i * delay * 0.65,
                    },
                }),
                transition: i => ({
                    opacity: [null, 0, 1, 0],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
            },
            last: {
                hover: i => ({
                    opacity: [null, 0, 0, 1],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
                notHover: i => ({
                    opacity: [null, 0, 0, 0],
                    transition: {
                        duration: duration * 0.65,
                        delay: i * delay * 0.65,
                    },
                }),
                transition: i => ({
                    opacity: [null, 0, 0, 0],
                    transition: {
                        duration: duration,
                        delay: i * delay + (duration * 0.25),
                    },
                }),
            }
        }
        if(letter === " ") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>f</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>G</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Й" || letter === "й" || letter === "Q" || letter === "q") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>f</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>G</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ц" || letter === "ц" || letter === "W" || letter === "w") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>G</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>X</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "У" || letter === "у" || letter === "E" || letter === "e") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "К" || letter === "к" || letter === "R" || letter === "r") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>V</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>W</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Е" || letter === "е" || letter === "T" || letter === "t") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>3</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>9</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Н" || letter === "н" || letter === "Y" || letter === "y") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Г" || letter === "г" || letter === "U" || letter === "u") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ш" || letter === "ш" || letter === "I" || letter === "i") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Щ" || letter === "щ" || letter === "O" || letter === "o") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>G</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>R</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "З" || letter === "з" || letter === "P" || letter === "p") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>X</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Х" || letter === "х") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>E</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>T</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ф" || letter === "ф" || letter === "A" || letter === "a") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>G</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ы" || letter === "ы" || letter === "S" || letter === "s") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>U</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>Q</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "В" || letter === "в" || letter === "D" || letter === "d") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "А" || letter === "а" || letter === "F" || letter === "f") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>F</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>J</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "П" || letter === "п" || letter === "G" || letter === "g") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>8</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>W</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Р" || letter === "р" || letter === "H" || letter === "h") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>U</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "О" || letter === "о" || letter === "J" || letter === "j") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>U</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Л" || letter === "л" || letter === "K" || letter === "k") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Д" || letter === "д" || letter === "L" || letter === "l") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>X</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>C</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ж" || letter === "ж" || letter === "Z" || letter === "z") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Э" || letter === "э" || letter === "X" || letter === "x") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Я" || letter === "я" || letter === "C" || letter === "c") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>X</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ч" || letter === "ч" || letter === "V" || letter === "v") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>9</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>W</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "С" || letter === "с" || letter === "B" || letter === "b") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "М" || letter === "м" || letter === "N" || letter === "n") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>D</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "И" || letter === "и" || letter === "M" || letter === "m") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Т" || letter === "т" || letter === "." || letter === "!") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>X</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ь" || letter === "ь" || letter === "#" || letter === "$") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>X</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Б" || letter === "б" || letter === "%" || letter === "^") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>M</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "Ю" || letter === "ю" || letter === "&" || letter === "*") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "1") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>Q</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>W</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "2" || letter === "(" || letter === ")" || letter === "-" || letter === "=") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>X</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>E</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "3") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>J</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "4") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>K</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>x</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "5") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>O</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "6") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>3</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>U</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "7") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>8</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "8") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>E</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>Q</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "9") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
        if(letter === "0") {
            return <>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.first}>{letter}</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span1}>Y</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.span2}>A</motion.span>
            <motion.span custom={i} animate={transition === true ? "transition" : (hoveredElement === elementName) ? "hover" : "notHover"} variants={animations.last}>{letter}</motion.span>
            </>
        }
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
        >
            <div className={`${styles.headerText} ${styles.glitchText} ${styles.instant} ${hoveredElement === "menu" && styles.active}`}>
                {menuText.ru.split('').map((liLetter, letterIndex) => {
                    return <div className={styles.spanParent} key={`spanKey ${letterIndex}`}>
                        {chooseLetters(liLetter, `menu`, letterIndex, 0.3, 0.1)}
                    </div>
                })}
            </div>
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
                return <div key={`li ${liIndex}`} className={`${styles.li} ${styles.glitchText} ${(hoveredElement === liIndex || transition === true) && styles.active} `}
                onPointerEnter={() => {
                    setHoveredElement(`hoveredLi${liIndex}`)
                }}
                onPointerLeave={() => {
                    // setHoveredElement('')
                }}
                >

                    <div className={`${styles.languageParent}`}>
                        <div className={`${styles.languageContent} ${styles.ru} ${language === "RU" && styles.active}`}>
                            {li.ru.split('').map((liLetter, letterIndex) => (
                            <div className={`${styles.spanParent}`} key={`ruSpanKey${letterIndex}`}>
                                {chooseLetters(liLetter, `hoveredLi${liIndex}`, letterIndex, 0.3, 0.1)}
                            </div>
                            ))}
                        </div>
                        <div className={`${styles.languageContent} ${styles.en} ${language === "EN" && styles.active}`}>
                            {li.en.split('').map((liLetter, letterIndex) => (
                            <div className={`${styles.spanParent}`} key={`enSpanKey${letterIndex}`}>
                                {chooseLetters(liLetter, `hoveredLi${liIndex}`, letterIndex, 0.3, 0.1)}
                            </div>
                            ))}
                        </div>
                    </div>

                </div>
            })}
        </div>
    </div>
    <div className={styles.bottomHud}>
        <div className={styles.leftPanel}>
            <div className={styles.logoBlock}>
                <div className={styles.logoImage}>
                    <img src="/images/logo.png" alt="Lavaweb logo" />
                </div>
                <div className={`${styles.logoText} ${styles.glitchText}`}>
                    <div className={`${styles.languageParent}`}>
                        <div className={`${styles.languageContent} ${styles.ru} ${language === "RU" && styles.active}`}>
                            <div className={styles.textLine}>
                                {texts.companyDescription[0].ru.split('').map((textLetter, letterIndex) => (
                                    <div className={`${styles.spanParent}`} key={`ruSpanKey${letterIndex}`}>
                                        {chooseLetters(textLetter, ``, letterIndex, 0.1, 0.01)}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.textLine}>
                                {texts.companyDescription[1].ru.split('').map((textLetter, letterIndex) => (
                                    <div className={`${styles.spanParent}`} key={`ruSpanKey${letterIndex}`}>
                                        {chooseLetters(textLetter, ``, letterIndex, 0.1, 0.01)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`${styles.languageContent} ${styles.en} ${language === "EN" && styles.active}`}>
                            <div className={styles.textLine}>
                                {texts.companyDescription[0].en.split('').map((textLetter, letterIndex) => (
                                    <div className={`${styles.spanParent}`} key={`enSpanKey${letterIndex}`}>
                                        {chooseLetters(textLetter, ``, letterIndex, 0.1, 0.01)}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.textLine}>
                                {texts.companyDescription[1].en.split('').map((textLetter, letterIndex) => (
                                    <div className={`${styles.spanParent}`} key={`enSpanKey${letterIndex}`}>
                                        {chooseLetters(textLetter, ``, letterIndex, 0.1, 0.01)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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