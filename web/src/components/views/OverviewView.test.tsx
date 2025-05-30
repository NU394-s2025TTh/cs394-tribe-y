import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import { OverviewView } from "./OverviewView"
import * as JsonDataContext from "../../context/JsonDataContext"

vi.mock("../../context/JsonDataContext", () => ({
    useJsonData: vi.fn(),
}))

describe("OverviewView", () => {
    test("renders nothing when jsonData is null", () => {
        ;(JsonDataContext.useJsonData as vi.Mock).mockReturnValue({ jsonData: null })
        const { container } = render(<OverviewView />)
        expect(container.firstChild).toBeNull()
    })
})
