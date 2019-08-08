/**
 * 체크아웃 화면 서블릿 
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-01-29
 */

package html.app.dev;
import java.io.*;
import java.sql.SQLException;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.*;

import app.common.PrjInfo;
import app.common.SysInfo;
import app.common.SystemPath;
import app.common.excelUtil;
import app.eCmd.Cmd0100;
import app.eCmr.Cmr0100;
import app.eCmr.Cmr0200;
import app.eCmr.Confirm_select;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/dev/CheckOutServlet")
public class CheckOutServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmr0100 cmr0100  = new Cmr0100();
	SysInfo sysinfo = new SysInfo();
	PrjInfo prjInfo = new PrjInfo();
	Cmd0100 cmd0100 = new Cmd0100();
	SystemPath systemPath = new SystemPath();
	Cmr0200 cmr0200 = new Cmr0200();
	Confirm_select confirm = new Confirm_select();
	excelUtil excelUtil = new excelUtil();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );

		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			switch (requestType) {
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getPrjList" :
					response.getWriter().write( getPrjList(jsonElement) );
					break;
				case "PRGCOMBO" :
					response.getWriter().write( getRsrcOpen(jsonElement) );
					break;
				case "getRsrcPath" :
					response.getWriter().write( getRsrcPath(jsonElement) );
					break;
				case "CHILDFILETREE" :
					response.getWriter().write( getChidrenTree(jsonElement) );
					break;
				case "GETFILEGRID":
					response.getWriter().write( getFileList(jsonElement) );
					break;
				case "getDownFileList":
					response.getWriter().write( getDownFileList(jsonElement) );
					break;
				case "GETLOCALHOME":
					response.getWriter().write( getDevHome(jsonElement));
					break;
				case "confSelect":
					response.getWriter().write( confSelect(jsonElement));
					break;
				case "Confirm_Info":
					response.getWriter().write( Confirm_Info(jsonElement));
					break;
				case "request_Check_Out":
					response.getWriter().write( request_Check_Out(jsonElement));
					break;
				case "svrFileMake":
					response.getWriter().write( svrFileMake(jsonElement));
					break;	
				case "getProgFileList":
					response.getWriter().write( getProgFileList(jsonElement));
					break;
				case "getTmpDir":
					response.getWriter().write( getTmpDir(jsonElement));
					break;
				case "getArrayCollection":
					response.getWriter().write( getArrayCollection(jsonElement));
					break;
				case "getFileList_excel":
					response.getWriter().write( getFileList_excel(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}//end of getSysInfo() method statement
	
	private String getProgFileList(JsonElement jsonElement) throws SQLException, Exception {
		String acptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ACPTNO") );
		return gson.toJson( cmr0100.getProgFileList(acptNo, "G"));
	}
	
	private String svrFileMake(JsonElement jsonElement) throws SQLException, Exception {
		String acptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ACPTNO") );
		return gson.toJson( cmr0100.svrFileMake(acptNo));
	}
	
	private String request_Check_Out(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	requestMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "requestData"));
		ArrayList<HashMap<String, String>> requestFiles = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "requestFiles"));
		ArrayList<HashMap<String, Object>> requestConfirmData = changeLinkedTreeMapToMap(ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement, "requestConfirmData")));
		return gson.toJson( cmr0100.request_Check_Out(requestFiles, requestMap, requestConfirmData) );
	}
	
	private ArrayList<HashMap<String, Object>> changeLinkedTreeMapToMap(ArrayList<HashMap<String, Object>> changeTargetArr) {
		
		for(int i=0; i<changeTargetArr.size(); i++) {
			String jsonStr = changeTargetArr.get(i).get("arysv").toString();
			ArrayList<HashMap<String, Object>> arrayList = ParsingCommon.jsonStrToArrObj(jsonStr);
			changeTargetArr.get(i).put("arysv",arrayList);
		}
		
		return changeTargetArr;
	}
	
	private String Confirm_Info(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	confirmInfoMap = null;
		confirmInfoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "confirmInfoData"));
		return gson.toJson( confirm.Confirm_Info(confirmInfoMap) );
	}
	
	private String confSelect(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	confirmInfoMap = null;
		confirmInfoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "confirmInfoData"));
		return gson.toJson( cmr0200.confSelect(	confirmInfoMap.get("sysCd"),
												confirmInfoMap.get("strReqCd"),
												confirmInfoMap.get("strRsrcCd"),
												confirmInfoMap.get("userId"),
												confirmInfoMap.get("strQry")) );
	}
	
	private String getDevHome(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	localHomeMap = null;
		localHomeMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "devHomeData"));
		return gson.toJson( systemPath.getDevHome(localHomeMap.get("UserId"), localHomeMap.get("SysCd")) );
	}
	
	private String getChidrenTree(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 childrenMap = null;
		childrenMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "childFileTreeData"));
		// childFileTreeData 가 없으면 return
		if(childrenMap.size() < 1) {
			return "";
		}
		return makeChildrenTree(
					childrenMap.get("Rsrccd"), 
					childrenMap.get("FileInfo"), 
					childrenMap.get("FileId"), 
					childrenMap.get("UserId"), 
					childrenMap.get("SysCd"));
	}
	
	private String makeChildrenTree(String Rsrccd, String FileInfo, String FileId, String UserId, String SysCd) {
		
		ArrayList<HashMap<String, String>> rtRsrcPathList = null;
		ArrayList<HashMap<String, String>> mergePathList  =  new ArrayList<HashMap<String, String>>();
		try {
				
			rtRsrcPathList = (ArrayList<HashMap<String, String>>) systemPath.getDirPath3(	UserId, 
																							SysCd, 
																							Rsrccd, 
																							FileInfo, 
																							FileId);
			
			for(HashMap<String, String> pathMap: rtRsrcPathList) {
				
				pathMap.put("id", 	pathMap.get("cm_seqno"));
				pathMap.put("pId", 	pathMap.get("cm_upseq"));
				//pathMap.put("pid", 	pathMap.get("cm_upseq"));
				pathMap.put("order","1");
				pathMap.put("text", pathMap.get("cm_dirpath"));
				pathMap.put("value", pathMap.get("cr_rsrccd"));
				pathMap.put("fullpath", pathMap.get("cm_fullpath"));
				pathMap.put("dsncd", pathMap.get("cr_dsncd"));
			}
			
			mergePathList.addAll(mergePathList.size(), rtRsrcPathList);
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			return gson.toJson(mergePathList);
		}
		
	}
	
	private String getRsrcPath(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 rsrcPathMap = null;
		rsrcPathMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "treeInfoData"));
		return gson.toJson( systemPath.getRsrcPath(
								rsrcPathMap.get("UserId"),
								rsrcPathMap.get("SysCd") , 
								rsrcPathMap.get("SecuYn"), 
								rsrcPathMap.get("SinCd"), 
								rsrcPathMap.get("ReqCd")) );
	}
	
	
	
	private String getRsrcOpen(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 prgoMap = null;
		prgoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "progData"));
		return gson.toJson( cmd0100.getRsrcOpen(prgoMap.get("SysCd"), prgoMap.get("SelMsg")));
	}
	
	private String getPrjList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 srMap = null;
		srMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "srData"));
		return gson.toJson( prjInfo.getPrjList(srMap));
	}
	
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 sysMap = null;
		sysMap =  ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "sysData"));
		return gson.toJson( sysinfo.getSysInfo(
								sysMap.get("UserId"), 
								sysMap.get("SecuYn"), 
								sysMap.get("SelMsg"), 
								sysMap.get("CloseYn"), 
								sysMap.get("ReqCd")));
	}
	
	private String getFileList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 downFileData = null;
		downFileData =  ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "getFileData"));
		
		/*HashMap<String, Object> fileReturnMap = new HashMap<>();
		fileReturnMap.put("fileData", cmr0100.getFileList(downFileData));
		return  gson.toJson(fileReturnMap);*/
		return  gson.toJson(cmr0100.getFileList(downFileData));
	}
	
	private String getDownFileList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 downFileData = null;
		ArrayList<HashMap<String, String>> 	 downFilelist = null;
		
		downFileData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "downFileData"));
		downFilelist = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "removedFileList"));
		
		return gson.toJson(cmr0100.getDownFileList( 	downFileData.get("strUserId"), 
														downFilelist, 
														downFileData.get("strReqCD"), 
														downFileData.get("syscd"), 
														downFileData.get("sayu"),
														false)  );
	}

	private String getTmpDir(JsonElement jsonElement) throws SQLException, Exception {
		String pCode = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pCode") );
		return gson.toJson(systemPath.getTmpDir(pCode));
	}
	
	private String getArrayCollection(JsonElement jsonElement)throws SQLException, Exception{
		String						 filePath = null;
		ArrayList<String> 	 headerDef = null;

		filePath = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "filePath") );
		headerDef = ParsingCommon.jsonStrToArrStr(ParsingCommon.jsonEtoStr(jsonElement, "headerDef"));
		return gson.toJson(excelUtil.getArrayCollection(filePath, headerDef));
		
	}

	private String getFileList_excel(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> 	 fileList = null;
		HashMap<String, String>				   fileData = null;

		fileList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "fileList"));
		fileData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "fileData"));
		return gson.toJson(cmr0100.getFileList_excel(fileList, fileData.get("SysCd"), fileData.get("SysGb"), fileData.get("ReqCd")));
	}
}
