package html.app.winpop;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.PrjInfo;
import app.common.SysInfo;
import app.common.SystemPath;
import app.eCmd.Cmd0100;
import app.eCmd.svrOpen;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/PopDevRepositoryServlet")
public class PopDevRepositoryServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmd0100    cmd0100    = new Cmd0100();
	PrjInfo    prjinfo    = new PrjInfo();
	SysInfo    sysinfo    = new SysInfo();
	SystemPath systempath = new SystemPath();
	svrOpen	   svropen	  = new svrOpen();
	
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
				case "GETSYSTEMPATH" :
					response.getWriter().write( getSystemPath(jsonElement) );
					break;
				case "GETSYSINFO" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "GETJOBINFO" :
					response.getWriter().write( getJobInfo(jsonElement) );
					break;
				case "GETJAWON" :
					response.getWriter().write( getJawon(jsonElement) );
					break;
				case "GETSVRINFO" :
					response.getWriter().write( getSvrInfo(jsonElement) );
					break;
				case "GETSRID" :
					response.getWriter().write( getSrId(jsonElement) );
					break;
				case "GETHOMEDIRLIST" :
					response.getWriter().write( getHomeDirList(jsonElement) );
					break;
				case "GETSVRDIR" :
					response.getWriter().write( getSvrDir(jsonElement) );
					break;
				case "GETCHILDSVRDIR" :
					response.getWriter().write( getChildSvrDir(jsonElement) );
					break;
				case "GETFILELIST_THREAD" :
					response.getWriter().write( getFileList_thread(jsonElement) );
					break;
				case "REGISTPROG" :
					response.getWriter().write( registProg(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	private String getSystemPath(JsonElement jsonElement) throws SQLException, Exception {
		String pathcd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pathcd"));
		return gson.toJson(systempath.getTmpDir(pathcd));
	}
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getSysInfo(DataMap.get("userId"),
											  DataMap.get("secuYn"),
											  DataMap.get("selMsg"),
											  DataMap.get("closeYn"), 
											  DataMap.get("reqCd")));
	}
	
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getJobInfo(DataMap.get("userId"),
											  DataMap.get("sysCd"),
											  DataMap.get("secuYn"),
											  DataMap.get("closeYn"), 
											  DataMap.get("selMsg"),
											  DataMap.get("sortCd")));
	}
		
	private String getJawon(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0100.getRsrcOpen(DataMap.get("sysCd"),
											   DataMap.get("selMsg")));
	}
	
	private String getSvrInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getsvrInfo(DataMap.get("userId"),
											  DataMap.get("sysCd"),
											  DataMap.get("secuYn"),
											  DataMap.get("selMsg")));
	}
	
	private String getSrId(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(prjinfo.getPrjList(DataMap));
	}
	
	private String getHomeDirList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(svropen.getHomeDirList(DataMap.get("UserId"),
												  DataMap.get("SysCd"),
												  DataMap.get("svrCd"),
												  DataMap.get("seqNo"),
												  DataMap.get("svrInfo"),
												  DataMap.get("svrHome")));
	}
	
	private String getSvrDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		try {
//			return gson.toJson(svropen.getSvrDir_HTML5(DataMap.get("UserId"),
//				  	   DataMap.get("SysCd"),
//				  	   DataMap.get("SvrIp"),
//				  	   DataMap.get("SvrPort"),
//				  	   DataMap.get("BaseDir"),
//				  	   DataMap.get("AgentDir"),
//				  	   DataMap.get("SysOs"),
//				  	   DataMap.get("HomeDir"),
//				  	   DataMap.get("svrName"),
//					   DataMap.get("buffSize")));
			return gson.toJson(svropen.getSvrDir_HTML5(DataMap));
		}catch (Exception e) {
			return gson.toJson("[ERR]" + e.getMessage());
		}
	}
	
	private String getChildSvrDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		if(DataMap.size() < 1) {
			return "";
		}
		return makeChildrenTree(DataMap);
//		return gson.toJson(svropen.getSvrDir_HTML5(DataMap.get("UserId"),
//											  	   DataMap.get("SysCd"),
//											  	   DataMap.get("SvrIp"),
//											  	   DataMap.get("SvrPort"),
//											  	   DataMap.get("BaseDir"),
//											  	   DataMap.get("AgentDir"),
//											  	   DataMap.get("SysOs"),
//											  	   DataMap.get("HomeDir"),
//											  	   DataMap.get("svrName"),
//											  	   DataMap.get("buffSize")));
	}
	
	private String makeChildrenTree(HashMap<String, String> DataMap) {
		
		ArrayList<HashMap<String, String>> childDirList = null;
		ArrayList<HashMap<String, String>> mergeDirList  =  new ArrayList<HashMap<String, String>>();
		try {
				
//			childDirList = (ArrayList<HashMap<String, String>>) svropen.getChildSvrDir_HTML5(DataMap.get("UserId"),
//																					  	     DataMap.get("SysCd"),
//																					  	     DataMap.get("SvrIp"),
//																					  	     DataMap.get("SvrPort"),
//																						  	 DataMap.get("BaseDir"),
//																						  	 DataMap.get("AgentDir"),
//																						  	 DataMap.get("SysOs"),
//																						  	 DataMap.get("HomeDir"),
//																						  	 DataMap.get("svrName"),
//																							 DataMap.get("buffSize"));
			
			childDirList = (ArrayList<HashMap<String, String>>) svropen.getChildSvrDir_HTML5(DataMap);
				
			for(HashMap<String, String> pathMap: childDirList) {
				
				pathMap.put("id", 	pathMap.get("cm_seqno"));
				pathMap.put("pId", 	pathMap.get("cm_upseq"));
				//pathMap.put("pid", 	pathMap.get("cm_upseq"));
				pathMap.put("order","1");
				pathMap.put("text", pathMap.get("cm_dirpath"));
				//pathMap.put("value", pathMap.get("cr_rsrccd"));
				pathMap.put("fullpath", pathMap.get("cm_fullpath"));
				//pathMap.put("dsncd", pathMap.get("cr_dsncd"));
			}
			
			mergeDirList.addAll(mergeDirList.size(), childDirList);
			//System.out.println("return: " + gson.toJson(mergeDirList));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			return gson.toJson(mergeDirList);
		}
		
	}
	
	private String getFileList_thread(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
//		return gson.toJson(svropen.getFileList_thread_HTML5(DataMap.get("UserId"),
//											  	   	  		DataMap.get("SysCd"),
//											  	   	  		DataMap.get("SvrIp"),
//											  	   	  		DataMap.get("SvrPort"),
//											  	   	  		DataMap.get("HomeDir"),
//											  	   	  		DataMap.get("BaseDir"),
//											  	   	  		DataMap.get("SvrCd"),
//											  	   	  		DataMap.get("GbnCd"),
//											  	   	  		DataMap.get("exeName1"),
//											  	   	  		DataMap.get("exeName2"),
//											  	   	  		DataMap.get("SysInfo"),
//											  	   	  		DataMap.get("AgentDir"),
//											  	   	  		DataMap.get("SysOs"), 
//											  	   	  		DataMap.get("buffSize"),
//											  	   	  		DataMap.get("svrInfo"),
//											  	   	  		DataMap.get("svrSeq")));
		return gson.toJson(svropen.getFileList_thread_HTML5(DataMap));
	}
	
	private String registProg(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		ArrayList<HashMap<String, String>> ProgList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "tmpAry") );
		return gson.toJson(svropen.cmr0020_Insert_thread(ProgList, DataMap));
	}
}