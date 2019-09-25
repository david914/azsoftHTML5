package app.common;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Header;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.ecams.common.logger.EcamsLogger;


/** xls , xlsx ��� ����
 * @author Administrator
 *
 */
public class excelUtil {

	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

	/**
	 * <PRE>
	 * 1. MethodName	: getArrayCollection
	 * 2. ClassName		: excelUtil
	 * 3. Commnet			:
	 * 4. �ۼ���				: Administrator
	 * 5. �ۼ���				: 2010. 12. 29. ���� 7:13:33
	 * </PRE>
	 * 		@return Object[]
	 * 		@param filePath
	 * 		@param headerDef
	 * 		@return
	 * 		@throws IOException
	 * 		@throws Exception
	 */
	public Object[] getArrayCollection(String filePath,ArrayList<String> headerDef) throws IOException, Exception {
		Object[]		  rtObj		  = null;

		ArrayList<HashMap<String, String>>  rtList = null;
		HashMap<String, String>			    rst	   = null;

		Workbook wb;
		Sheet sheet = null;
		Row row = null;
		Cell cell = null;

		int firstRow;
		int lastRow;
		int rowIdx;

		short firstCell;
		short lastCell;
		short cellIdx;

		try {
			ecamsLogger.error("++++ filePath+++"+filePath);
			filePath = filePath.trim();
			filePath = filePath.replace("//", "/");
			filePath = filePath.replace("/", "//");
			//ecamsLogger.error("filePath[2] : " + filePath);

			//��ũ�� ������Ʈ�� ���
			//wb = getXlsWorkBook(filePath);//xls �� xlsx�� �������� �Լ�
			//xls�� xlsx ���� ���
			wb = WorkbookFactory.create(new FileInputStream(filePath));

			// �� ��ũ��Ʈ���� ���
			//int sheetcount = wb.getNumberOfSheets();
			if (wb == null){
				throw new Exception("���� sheet �б� ����[excelUtil]");
			}
			sheet = wb.getSheetAt(0);

			// ��ũ��Ʈ�� �ִ� ù��� ���������� �ε����� ���
			firstRow = sheet.getFirstRowNum();
			lastRow = sheet.getLastRowNum();


			rtList = new ArrayList<HashMap<String, String>>();
			// �� ���� �����͸� ���


			for (rowIdx = firstRow; rowIdx <= lastRow; rowIdx++) {
				//���� ǥ���ϴ� ������Ʈ�� ���
				row = sheet.getRow(rowIdx);
				
				// �࿡ �����Ͱ� ���� ���
//				if (row == null) break;

				// �࿡�� ù���� ������ ���� �ε����� ���
				firstCell = row.getFirstCellNum();
				lastCell = row.getLastCellNum();

				if ((lastCell-firstCell) < headerDef.size()){
					throw new Exception("���������� ���� ������ ������ �ش��� �������� �����ϴ�.");
				}


				//�� ���� �����͸� ���

				rst   = new HashMap<String, String>();
				for (cellIdx = firstCell ; cellIdx <= lastCell; cellIdx++) {
					String data = null;

					if (headerDef.size()-1 < cellIdx){
						break;
					}
					if (headerDef.get(cellIdx) == null){
						break;
					}

					// ���� ǥ���ϴ� ������Ʈ�� ���
					cell = row.getCell(cellIdx);

					// �� ���� ���
					// break �ϰԵǸ� ����ִ� ������ �ִ� ��� �����͵� �ȵ� 
					if (cell == null) continue;

					//cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					// ���� �ִ� �������� ������ ���
					int type = cell.getCellType();

					// ������ �������� �����͸� ���
					switch (type) {
						case Cell.CELL_TYPE_BOOLEAN:
							boolean bdata = cell.getBooleanCellValue();
							data = String.valueOf(bdata);
							break;
						case Cell.CELL_TYPE_NUMERIC:
							double ddata = cell.getNumericCellValue();
							data = String.valueOf(((int)ddata));
							break;
						case Cell.CELL_TYPE_STRING:
							data = cell.getStringCellValue();
							break;
						case Cell.CELL_TYPE_BLANK:
						case Cell.CELL_TYPE_ERROR:
						case Cell.CELL_TYPE_FORMULA:
						default:
							continue;
					}
					rst.put(headerDef.get(cellIdx), data);
				}
				rtList.add(rst);
			}

			//excelFis.close();
			ecamsLogger.error("++++ rtList+++"+rtList.toString());
			rtObj =  rtList.toArray();
			//System.out.println("excelUtil[1]:"+rtList.toString());

			rtList = null;

			return rtObj;

		} catch (IOException exception) {
			exception.printStackTrace();
			ecamsLogger.error("## excelUtil.getArrayCollection() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## excelUtil.getArrayCollection() Exception END ##");
			throw exception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## excelUtil.getArrayCollection() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## excelUtil.getArrayCollection() Exception END ##");
			throw exception;
		} finally{
			if (rtObj != null)	rtObj = null;
		}
	}

	/**
	 * <PRE>
	 * 1. MethodName	: getExcelArrayCollection
	 * 2. ClassName		: excelUtil
	 * 3. Commnet			: �����׽�Ʈ/�����׽�Ʈ �׽�Ʈ���̽� [�����ε�]�� ����ϴ� �Լ�
	 * 4. �ۼ���				: no name
	 * 5. �ۼ���				: 2010. 12. 29. ���� 7:09:04
	 * </PRE>
	 * 		@return Object[]
	 * 		@param filePath
	 * 		@param headerDef
	 * 		@return
	 * 		@throws IOException
	 * 		@throws Exception
	 */
	public Object[] getExcelArrayCollection(String filePath,ArrayList<String> headerDef) throws IOException, Exception
	{
		Object[]		  rtObj		  = null;

		ArrayList<HashMap<String, String>>  rtList = null;
		HashMap<String, String>			    rst	   = null;

		Workbook wb;
		Sheet sheet = null;
		Row row = null;
		Cell cell = null;

		int firstRow;
		int lastRow;
		int rowIdx;

		short firstCell;
		short lastCell;
		short cellIdx;

		try {
			//ecamsLogger.error("filePath 111 : " + "["+filePath+"]");
			//filePath ="//ecams//hanabank//bin//tmp//9812370_excel.xls";
			filePath = filePath.trim();
			filePath = filePath.replace("//", "/");
			filePath = filePath.replace("/", "//");
			//ecamsLogger.error("filePath 222 : " + filePath);

			//��ũ�� ������Ʈ�� ���
//			wb = getXlsWorkBook(filePath);
			//xls�� xlsx ���� ���
			wb = WorkbookFactory.create(new FileInputStream(filePath));

			// �� ��ũ��Ʈ���� ���
			//int sheetcount = wb.getNumberOfSheets();


			sheet = wb.getSheetAt(0);

			// ��ũ��Ʈ�� �ִ� ù��� ���������� �ε����� ���
			firstRow = sheet.getFirstRowNum()+1; //����κ� �����ϱ� ���� ��ġ
			lastRow = sheet.getLastRowNum();


			rtList = new ArrayList<HashMap<String, String>>();
			// �� ���� �����͸� ���


			for (rowIdx = firstRow; rowIdx <= lastRow; rowIdx++) {
				//���� ǥ���ϴ� ������Ʈ�� ���
				row = sheet.getRow(rowIdx);

				// �࿡ �����Ͱ� ���� ���
				if (row == null) break;


				// �࿡�� ù���� ������ ���� �ε����� ���
				firstCell = row.getFirstCellNum();
				lastCell = row.getLastCellNum();
//
//				if ((lastCell-firstCell) < headerDef.size()){
//					//(kicc)header size���� ������� �����ؼ� �ּ�ó��.
//					//throw new Exception("���������� ���� ������ ������ �ش��� �������� �����ϴ�.");
//				}
//

				//�� ���� �����͸� ���
				rst   = new HashMap<String, String>();
				for (cellIdx = firstCell ; cellIdx <= lastCell; cellIdx++) {
					String data = null;

					if (headerDef.size()-1 < cellIdx){
						break;
					}
					/*//�ش缿 null �̿��� ���� ��ĭ���� �Ѱ�����ؼ� �ּ�ó�� - ȣ��
					if (headerDef.get(cellIdx) == null){
						break;
					}
					*/
					
					//ù��°���̸鼭 null �̸� braek;
					if (headerDef.get(cellIdx) == null && cellIdx == 1){
						break;
					}


					// ���� ǥ���ϴ� ������Ʈ�� ���
					cell = row.getCell(cellIdx);

					// �� ���� ���
					if (cell == null){
						//���� ���ΰ�� break; �ߴµ�
						//break;
						rst.put(headerDef.get(cellIdx), "");
					}else{

						//cell.setCellType(HSSFCell.CELL_TYPE_STRING);
						// ���� �ִ� �������� ������ ���
						int type = cell.getCellType();

						// ������ �������� �����͸� ���


						switch (type) {
							case Cell.CELL_TYPE_BOOLEAN:
								boolean bdata = cell.getBooleanCellValue();
								data = String.valueOf(bdata);
								data.trim();
								break;
							case Cell.CELL_TYPE_NUMERIC:
								double ddata = cell.getNumericCellValue();
								data = String.valueOf(((int)ddata));
								data.trim();
								break;
							case Cell.CELL_TYPE_STRING:
								data = cell.getStringCellValue();
								data.trim();
								break;
							case Cell.CELL_TYPE_BLANK:
							case Cell.CELL_TYPE_ERROR:
							case Cell.CELL_TYPE_FORMULA:
							default:
								continue;
						}
						rst.put(headerDef.get(cellIdx), data);
					}
				}
				rtList.add(rst);
			}

			//excelFis.close();

			rtObj =  rtList.toArray();
			//System.out.println("excelUtil[2]:"+rtList.toString());
			rtList = null;

			return rtObj;

		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## excelUtil.getExcelArrayCollection() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## excelUtil.getExcelArrayCollection() Exception END ##");
			throw exception;
		} finally{
			if (rtObj != null)	rtObj = null;
		}
	}

	/** ������ ���� ���� �ۼ��ϱ�
	 * <PRE>
	 * 1. MethodName	: setExcel
	 * 2. ClassName		: excelUtil
	 * 3. Commnet			:
	 * 4. �ۼ���				: Administrator
	 * 5. �ۼ���				: 2010. 12. 29. ���� 7:13:25
	 * </PRE>
	 * 		@return String
	 * 		@param filePath
	 * 		@param headerDef
	 * 		@param aryData
	 * 		@return
	 * 		@throws Exception
	 */
	public String setExcel(String filePath,ArrayList<String> headerDef,ArrayList<HashMap<String,String>> aryData) throws Exception
	{
		HashMap<String, String>			    rst	   = null;

		FileOutputStream excelFis = null;

		Workbook     wb;

		Sheet sheet = null;
		Row row = null;
		Cell cell = null;
		Header header = null;
		CellStyle cs = null;
		DataFormat df = null;
		Font f = null;

		try {
			boolean rowSw = false;
			int     wkCnt = 0;
			int     wkRow = 0;

	        if( filePath.matches(".*.xls")) {
	            wb = new HSSFWorkbook();
	        } else {
	            wb = new XSSFWorkbook();
	        }

			for (int i = 0;i<aryData.size();i++){

				if (i == 0) rowSw = true;
				else {
					if ((i%60000) == 0) rowSw = true;
					else rowSw = false;
				}
				if (rowSw == true) {
					if (i > 0) wkCnt = i/60000;
					++wkCnt;
					wkRow = 0;

					sheet = wb.createSheet("sheet"+Integer.toString(wkCnt));

					header = sheet.getHeader();
					header.setCenter("Center Header");

					cs = wb.createCellStyle();
					df = wb.createDataFormat();

					f = wb.createFont();
					f.setFontHeightInPoints((short) 10);
					f.setBoldweight(Font.BOLDWEIGHT_BOLD);

					cs.setFont(f);
					cs.setDataFormat(df.getFormat("#,##0.0"));
				}

                if (rowSw == true && i > 0) {
                	row = sheet.createRow(wkRow);
                	rst = aryData.get(0);

                	for (short j=0;j<rst.size();j++){
    					row.createCell(j).setCellValue(rst.get(headerDef.get((int)j)));

    					if (wkRow ==0){
    						// ���� ǥ���ϴ� ������Ʈ�� ���
    						cell = row.getCell(j);

    						// �� ���� ���
    						if (cell == null) break;

    						cell.setCellStyle(cs);
    					}
    				}
                	++wkRow;
                }
                row = sheet.createRow(wkRow);
                rst = aryData.get(i);

				for (short j=0;j<rst.size();j++){
					row.createCell(j).setCellValue(rst.get(headerDef.get((int)j)));

					if (wkRow ==0){
						// ���� ǥ���ϴ� ������Ʈ�� ���
						cell = row.getCell(j);

						// �� ���� ���
						if (cell == null) break;

						cell.setCellStyle(cs);
					}
				}
				++wkRow;
			}
			excelFis = new FileOutputStream(filePath);
		    wb.write(excelFis);
		    excelFis.close();
		    //ecamsLogger.error("#######   setExcel  end   #######");
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## excelUtil.getArrayCollection() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## excelUtil.getArrayCollection() Exception END ##");
			throw exception;
		}
		return filePath;
	}

	/** xls �� xlsx �����ؼ� workbook �ۼ�
	 * @param fileName
	 * @return XSSFWorkbook or HSSFWorkbook ����
	 * @throws Exception
	 */
//	private Workbook getXlsWorkBook(String fileName) throws Exception
//	{
//		Workbook     wb = null;
//
//		try {
//
//	        if( fileName.lastIndexOf(".xlsx")>0){
//	            FileInputStream fis =new FileInputStream(fileName);
//	            wb = new XSSFWorkbook(fis);
//	            fis.close();
//	        } else if( fileName.matches(".*.xls")) {
//	            FileInputStream fis =new FileInputStream(fileName);
//	            POIFSFileSystem filein =new POIFSFileSystem( fis);
//	            wb =new HSSFWorkbook(filein);
//	            filein = null;
//	            fis.close();
//	        }
//
//	        return wb;
//
//		} catch (Exception exception) {
//			exception.printStackTrace();
//			ecamsLogger.error("## excelUtil.getXlsWorkBook() Exception START ##");
//			ecamsLogger.error("## Error DESC : ", exception);
//			ecamsLogger.error("## excelUtil.getXlsWorkBook() Exception END ##");
//			throw exception;
//		} finally{
//			if (wb != null)	wb = null;
//		}
//    }
}
