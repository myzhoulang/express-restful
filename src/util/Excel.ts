import { Response } from 'express'
import exceljs, {
  Workbook,
  CalculationProperties,
  WorkbookProperties,
  AddWorksheetOptions,
  Worksheet,
  Column,
} from 'exceljs'

interface IWorkbookMetaData {
  creator: string
  lastModifiedBy: string
  created: Date
  modified: Date
  lastPrinted: Date
  properties: WorkbookProperties
  calcProperties: CalculationProperties
}

type metadataKey = keyof IWorkbookMetaData

/**
 * TODO:
 *  1. 样式填充
 *  2. 单元格合并
 *  3. 数据校验
 *  4. 公式计算
 *  5. 读取模板
 *  6. 返回流数据
 */
export default class Excel {
  workbook: Workbook
  sheets: Array<Worksheet> = []
  constructor(options: IWorkbookMetaData) {
    this.workbook = new exceljs.Workbook()
    Object.entries(options).forEach(([key, value]) => {
      this.workbook[key as metadataKey] = value
    })
  }

  findSheetByName(name: string): Worksheet | null {
    const sheet = this.sheets.find((item) => item.name === name) ?? null
    return sheet
  }

  addSheet(name: string, options?: Partial<AddWorksheetOptions>): Worksheet {
    const sheet = this.workbook.addWorksheet(name, options)
    this.sheets.push(sheet)
    return sheet
  }

  setColumns(name: string, columns: Array<Column>): Worksheet | null {
    const sheet = this.findSheetByName(name)
    if (sheet) {
      sheet.columns = columns
      return sheet
    }

    return null
  }

  addDatas<T>(name: string, datas: Array<T>, style?: string): Worksheet | null {
    const sheet = this.findSheetByName(name)
    if (sheet) {
      sheet.addRows(datas, style)
      return sheet
    }
    return null
  }

  writeFile(res: Response, name?: string) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader('Content-Disposition', `attachment; filename=${name ?? Date.now()}.xlsx`)
    this.workbook.xlsx.write(res).then(function (data) {
      res.end()
      console.log('File write done........')
    })
  }
}
