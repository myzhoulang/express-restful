import { Response } from 'express'
import exceljs, {
  Workbook,
  CalculationProperties,
  WorkbookProperties,
  AddWorksheetOptions,
  Worksheet,
  Row,
  Column,
  Style,
  Border,
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

interface IRowStyle {
  height?: number
  fill?: string
}
type rowStyleKey = keyof IRowStyle

const borderStyle: Border = { style: 'thin', color: { argb: 'FFCCCCCC' } }
const border = {
  top: borderStyle,
  left: borderStyle,
  bottom: borderStyle,
  right: borderStyle,
}
/**
 * TODO:
 *  1. 样式填充
 *  2. 单元格合并
 *  3. 数据校验
 *  4. 公式计算
 *  5. 读取模板
 *  6. 返回流数据
 *
 * FIXME:
 *  1. 不能统一设置高度  https://github.com/exceljs/exceljs/issues/422
 */
export default class Excel {
  workbook: Workbook
  sheets: Array<Worksheet> = []
  defaultColumnStyle: Partial<Style>
  constructor(options?: IWorkbookMetaData) {
    this.defaultColumnStyle = {
      border,
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    }
    // 默认选项
    const defaultOptions: IWorkbookMetaData = {
      creator: 'zhoulang',
      lastModifiedBy: 'zhoulang',
      created: new Date(),
      modified: new Date(),
      lastPrinted: new Date(),
      properties: {
        date1904: true,
      },
      calcProperties: {
        fullCalcOnLoad: true,
      },
    }
    this.workbook = new exceljs.Workbook()
    Object.entries(Object.assign(defaultOptions, options)).forEach(([key, value]) => {
      this.workbook[key as metadataKey] = value
    })
  }

  // 通过 name 查找 sheet
  findSheetByName(name: string): Worksheet | null {
    const sheet = this.sheets.find((item) => item.name === name) ?? null
    return sheet
  }

  // 新增 sheet
  addSheet(name: string, options?: Partial<AddWorksheetOptions>): Worksheet {
    const sheet = this.workbook.addWorksheet(name, options)
    this.sheets.push(sheet)
    return sheet
  }

  // 获取表头
  getHeader(name: string, rows: number) {
    const sheet = this.findSheetByName(name)
    return sheet?.getRow(rows)
  }

  // 设置行样式
  setRowStyle(row: Row, style: IRowStyle) {
    Object.entries(style).forEach(([key, value]) => {
      row[key as rowStyleKey] = value
    })
  }

  // 设置表头样式
  setHeaderStyle(header: Row, style: IRowStyle) {
    const fill = style.fill ?? 'FFD9D9D9'
    const merageStryle = Object.assign(
      {},
      {
        height: 20,
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: `${fill}` },
          bgColor: { argb: `${fill}` },
        },
      },
      style,
    )
    this.setRowStyle(header, merageStryle)
  }

  // FIXME:
  // 1. columns typescript check error https://github.com/exceljs/exceljs/issues/1543
  setColumns(name: string, columns: Array<any>): Worksheet | null {
    const sheet = this.findSheetByName(name)
    if (sheet) {
      const defaultColumnStyle = this.defaultColumnStyle
      sheet.columns = columns.map(({ border, alignment, ...other }) => {
        const custStyle = {
          alignment: Object.assign({}, defaultColumnStyle.alignment, alignment),
          border: Object.assign({}, defaultColumnStyle.border, border),
        }
        return {
          style: custStyle,
          ...other,
        }
      })
      return sheet
    }

    return null
  }

  // 添加数据到 sheet
  addDatas<T>(name: string, datas: Array<T>, style?: string): Worksheet | null {
    const sheet = this.findSheetByName(name)
    if (sheet) {
      sheet.addRows(datas, style)
      return sheet
    }
    return null
  }

  // 发送文件到客户端
  writeFile(res: Response, name?: string): Promise<void> {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader('Content-Disposition', `attachment; filename=${name ?? Date.now()}.xlsx`)
    return this.workbook.xlsx.write(res)
  }
}
