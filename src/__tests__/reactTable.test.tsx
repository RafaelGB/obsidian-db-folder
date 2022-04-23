import { render, screen } from "@testing-library/react";
import { Vault } from 'obsidian';
import { Database } from 'components/index/Database';
import {TableDataType} from 'cdm/FolderModel';
import { makeData } from "mock/mockUtils";
import React from "react";

jest.mock("obsidian");
const VaultMock = Vault as jest.MockedClass<typeof Vault>;
test("Render without crashing", () => {
    const mockedTableData:TableDataType = makeData(10);
    render(<Database {...mockedTableData} />);
    const titleLabel = screen.getByText(" title");
    expect(titleLabel).toBeInTheDocument();
  });