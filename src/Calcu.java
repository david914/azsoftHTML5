
public class Calcu {
	
	public static void main(String[] args) {
		
		int sumM = 0;
		int startM = 9000;
		int addM = 1000;
		
		for(int i=0; i<= 16 ; i++) {
			sumM += startM + addM * (i+1);
			System.out.println(i+10 + "���� : " + (startM + addM * (i+1) ));
		}
		
		
		System.out.println(sumM);
	}

}
