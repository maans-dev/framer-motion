import { render, click } from "../../../jest.setup"
import { fireEvent } from "@testing-library/react"
import * as React from "react"
import { useCycle } from "../use-cycle"

describe("useCycle", () => {
    test("cycles through given states", () => {
        const results: number[] = []

        const Component = () => {
            const [latest, cycle] = useCycle(1, 2, 3, 4)
            React.useEffect(() => {
                results.push(latest)
            }, [latest])

            return <div onClick={() => cycle()} />
        }

        const { container } = render(<Component />)

        click(container.firstChild as Element)
        click(container.firstChild as Element)
        click(container.firstChild as Element)
        click(container.firstChild as Element)

        /**
         * 1 is doubled at the start of the array because in StrictMode
         * useEffect is double-fired on mount.
         *
         * When resolution is changed to 18, add another 1 to start of array
         */
        expect(results).toEqual([1, 2, 3, 4, 1])
    })

    test("jumps to a given index", () => {
        let result: number = 0

        const Component = () => {
            const [latest, cycle] = useCycle(1, 2, 3, 4)
            result = latest
            return <div onClick={() => cycle(2)} />
        }

        const { container } = render(<Component />)
        fireEvent.click(container.firstChild as Element)

        expect(result).toBe(3)
    })

    test("is not functionally bound by the render cycle", () => {
        let result: number = 0

        const Component = () => {
            const [latest, cycle] = useCycle(1, 2, 3, 4)
            result = latest
            return <div onClick={() => (cycle(), cycle())} />
        }

        const { container } = render(<Component />)
        fireEvent.click(container.firstChild as Element)

        expect(result).toBe(3)
    })
})

// initial index
// cycle(index)
