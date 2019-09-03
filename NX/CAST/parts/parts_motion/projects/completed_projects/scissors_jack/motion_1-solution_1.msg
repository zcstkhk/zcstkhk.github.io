


  ************************************************************
  *                                                          *
  *                         RecurDyn                         *
  *                                                          *
  *             Recursive Dynamics Analysis Program          *
  *                                                          *
  ************************************************************
  *                                                          *
  *                Solver Version : SDK 5.02.1               *
  *                                                          *
  *                Build Date : Apr 25 2011                  *
  *                Build Time :    16:33:29                  *
  *                                                          *
  *                Copyright (C) 1997 - 2010                 *
  *                                                          *
  *                    Function Bay, Inc.                    *
  *                                                          *
  ************************************************************


 << RECURDYN/CONVERTER PROCESSING >>

 >> READING THE RMD FILE 
  >>> NO. PART = 9
  >>> NO. DUMMY PART = 0
  >>> NO. JOINT = 11

 >> SPANNING TREE 
  >>> NO. JOINT BEFORE SPANNING = 11
  >>> NO. VIRTUALJOINT BEFORE SPANNING = 0
  >>> NO. CUTJOINT BEFORE SPANNING = 0
  >>> NO. JOINT AFTER SPANNING = 11
  >>> NO. VIRTUALJOINT AFTER SPANNING = 0
  >>> NO. CUTJOINT AFTER SPANNING = 3

 >> CHECKING CUTJOINT 
 ======================================================================== 
               CONVERT-PROCESSING IS SUCCESSFULLY FINISHED
 ======================================================================== 

 << RECURDYN/SOLVER PROCESSING >>

 
 ============================================================
 >> BUILDING THE RD/SOLVER STRUCTURE
 ============================================================
 ============================================================
 >> THE SIZE OF USED INBODY ARRAY =           9
 ------------------------------------------------------------
 >> THE SIZE OF USED JOINT ARRAY =          80
 ------------------------------------------------------------
 >> THE SIZE OF USED JOINTIV ARRAY                 =                0
 ------------------------------------------------------------
 >> THE SIZE OF USED EXTPARIV ARRAY                =                0
 ------------------------------------------------------------
 >> THE SIZE OF USED CUTJOINT ARRAY =           9
 ------------------------------------------------------------
 >> THE SIZE OF USED FLEXBODY ARRAY =           0
 ============================================================
 ========================================================================
 >> THE SIZE OF USED N120 ARRAY                    =             3600
 ------------------------------------------------------------------------
 >> THE SIZE OF USED IPN16_1 ARRAY                 =              450
 ------------------------------------------------------------------------
 >> THE SIZE OF USED IPN17 ARRAY                   =              450
 ------------------------------------------------------------------------
 >> THE SIZE OF USED IPN18 ARRAY                   =              200
 ========================================================================
 ========================================================================
 >> THE SIZE OF USED N90 ARRAY                     =             7960
 ------------------------------------------------------------------------
 >> THE SIZE OF USED N90n1 ARRAY                   =             5608
 ------------------------------------------------------------------------
 >> THE SIZE OF USED N90n2 ARRAY                   =             1000
 ------------------------------------------------------------------------
 >> THE SIZE OF USED N90n3 ARRAY                   =             1000
 ========================================================================
 ============================================================
 >> THE SIZE OF USED RBUS ARRAY =       39344
 ------------------------------------------------------------
 >> THE SIZE OF USED IBUS ARRAY =        2618
 ------------------------------------------------------------
 >> THE SIZE OF USED LBUS ARRAY =        3236
 ------------------------------------------------------------
 >> THE SIZE OF USED MGRBUS ARRAY =         208
 ------------------------------------------------------------
 >> THE SIZE OF USED OBUS ARRAY                    =              448
 ========================================================================
 >>> SUCCESSFULLY BUILT THE RD/SOLVER STRUCTURE


                         JOINT INFORMATION 
      =======================================================
        JOINT ID  ACTION MARKER    BASE MARKER     TYPE
      =======================================================
           31          40              41        REVOLUTE   
           47          56              57        REVOLUTE   
          127         136             137      TRANSLATIONAL
           63          72              73        REVOLUTE   
           95         105             104        REVOLUTE   
          176         185             186        REVOLUTE   
          192         202             201          SCREW    
           79          88              89        REVOLUTE   
      =======================================================
 
                       CONSTRAINT INFORMATION
      =======================================================
      CONSTRAINT ID   ACTION MARKER   BASE MARKER    TYPE
      =======================================================
          140             150            149        REVOLUTE     
          111             121            120        REVOLUTE     
          156             166            165        REVOLUTE     
      =======================================================
 
      CONSTRAINT ID    JOINT1    JOINT2    JOINT3    TYPE
      =======================================================
      1000000          176                          MOTION
      =======================================================
 
 
 ======================================================================
 *** WHAT = 
 sim/dyn,end=20.000000,step=40                                                  
  
 ======================================================================
 *** TOKEN SIMULATION TYPE = dyn
 *** TOKEN ENDTIME =   20.0000000000000        1.00000000000000     
 *** TOKEN PLOT STEPSIZE =          40          30
 
 ============================================================
 >> POSITION ANALYSIS
 ============================================================


                   INITIAL POSITION CONSTRAINT VIOLATION
 ========================================================================
        ID JOINT               ELEMENT                    VIOLATION
 ========================================================================
        31 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y           2.573676E-10
                               ROTATION ABOUT X           0.000000E+00
 ========================================================================
        47 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y          -4.202555E-10
                               ROTATION ABOUT X           0.000000E+00
 ========================================================================
       127 TRANSLATIONAL       ROTATION ABOUT Y          -9.489702E-11
                               ROTATION ABOUT X           0.000000E+00
                               TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               ROTATION ABOUT Z           7.128078E-26
 ========================================================================
        63 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y           1.797366E-10
                               ROTATION ABOUT X          -2.871863E-21
 ========================================================================
        95 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y          -4.505295E-10
                               ROTATION ABOUT X          -2.317013E-20
 ========================================================================
       176 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y           3.048970E-10
                               ROTATION ABOUT X          -1.730006E-19
 ========================================================================
       192 SCREW               ROTATION ABOUT Y           5.148970E-10
                               ROTATION ABOUT X          -2.676119E-19
                               TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               PITCH                      0.000000E+00
 ========================================================================
        79 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y          -6.426387E-10
                               ROTATION ABOUT X          -8.091304E-20
 ========================================================================
       140 REVOLUTE            TRANSLATION ALONG X        1.569620E-08
 ========================================================================
                               TRANSLATION ALONG Y        2.320778E-07
 ========================================================================
                               TRANSLATION ALONG Z       -5.667366E-08
 ========================================================================
                               ROTATION ABOUT Y          -5.731063E-10
 ========================================================================
                               ROTATION ABOUT X           7.902269E-10
 ========================================================================
       111 REVOLUTE            TRANSLATION ALONG X        4.673791E-08
 ========================================================================
                               TRANSLATION ALONG Y        2.035858E-08
 ========================================================================
                               TRANSLATION ALONG Z       -1.665349E-08
 ========================================================================
                               ROTATION ABOUT Y          -1.272905E-09
 ========================================================================
                               ROTATION ABOUT X           3.079610E-15
 ========================================================================
       156 REVOLUTE            TRANSLATION ALONG X        6.278810E-09
 ========================================================================
                               TRANSLATION ALONG Y       -5.522484E-08
 ========================================================================
                               TRANSLATION ALONG Z       -2.193418E-08
 ========================================================================
                               ROTATION ABOUT Y          -1.250736E-09
 ========================================================================
                               ROTATION ABOUT X           7.902023E-10
 ========================================================================
   1000000        MOTION                                  0.000000E+00
 ========================================================================
 


                  REDUNDANT CONSTRAINT INFORMATION
 ========================================================================
      CONSTRAINT ID            TYPE            REDUNDANT
 ========================================================================
          140                REVOLUTE            TRANSLATION ALONG Y     
          140                REVOLUTE            ROTATION ABOUT Y        
          140                REVOLUTE            ROTATION ABOUT X        
          111                REVOLUTE            TRANSLATION ALONG Y     
          111                REVOLUTE            ROTATION ABOUT X        
          156                REVOLUTE            TRANSLATION ALONG Y     
          156                REVOLUTE            ROTATION ABOUT Y        
          156                REVOLUTE            ROTATION ABOUT X        
 ========================================================================
 ========================================================================
 ========================================================================
 ========================================================================
 ** NO. OF REDUNDANT CONSTRAINT =           8


                       POSITION CONSTRAINT VIOLATION
 ========================================================================
        ID JOINT               ELEMENT                    VIOLATION
 ========================================================================
        31 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y           2.573676E-10
                               ROTATION ABOUT X          -2.904614E-20
 ========================================================================
        47 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y          -4.202555E-10
                               ROTATION ABOUT X           1.214158E-19
 ========================================================================
       127 TRANSLATIONAL       ROTATION ABOUT Y          -9.489702E-11
                               ROTATION ABOUT X           0.000000E+00
                               TRANSLATION ALONG X        2.269404E-38
                               TRANSLATION ALONG Y        0.000000E+00
                               ROTATION ABOUT Z           7.128078E-26
 ========================================================================
        63 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y           1.797366E-10
                               ROTATION ABOUT X           2.025516E-19
 ========================================================================
        95 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y          -4.505295E-10
                               ROTATION ABOUT X           1.880829E-19
 ========================================================================
       176 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y           3.048970E-10
                               ROTATION ABOUT X          -1.108881E-19
 ========================================================================
       192 SCREW               ROTATION ABOUT Y           5.148970E-10
                               ROTATION ABOUT X           6.181071E-20
                               TRANSLATION ALONG X       -2.337114E-19
                               TRANSLATION ALONG Y        1.345324E-23
                               PITCH                      2.025899E-09
 ========================================================================
        79 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               TRANSLATION ALONG Z        0.000000E+00
                               ROTATION ABOUT Y          -6.426387E-10
                               ROTATION ABOUT X           1.624012E-23
 ========================================================================
       140 REVOLUTE            TRANSLATION ALONG X        0.000000E+00
 ========================================================================
                               TRANSLATION ALONG Y           REDUNDANT
 ========================================================================
                               TRANSLATION ALONG Z        0.000000E+00
 ========================================================================
                               ROTATION ABOUT Y              REDUNDANT
 ========================================================================
                               ROTATION ABOUT X              REDUNDANT
 ========================================================================
       111 REVOLUTE            TRANSLATION ALONG X       -2.842171E-14
 ========================================================================
                               TRANSLATION ALONG Y           REDUNDANT
 ========================================================================
                               TRANSLATION ALONG Z       -2.842171E-14
 ========================================================================
                               ROTATION ABOUT Y           3.881682E-25
 ========================================================================
                               ROTATION ABOUT X              REDUNDANT
 ========================================================================
       156 REVOLUTE            TRANSLATION ALONG X       -2.842171E-14
 ========================================================================
                               TRANSLATION ALONG Y           REDUNDANT
 ========================================================================
                               TRANSLATION ALONG Z        0.000000E+00
 ========================================================================
                               ROTATION ABOUT Y              REDUNDANT
 ========================================================================
                               ROTATION ABOUT X              REDUNDANT
 ========================================================================
   1000000        MOTION                                  1.033976E-24
 ========================================================================
 
 >>> POSITION-ANALYSIS IS SUCCESSFULLY FINISHED
 ======================================================================== 
 >>> System Variables After Position Analysis
 ======================================================================== 
 SEQ TYPE                     NAME         DOF                    
 ------------------------------------------------------------------------ 
   1 REVOLUTE JOINT                  31    ROTATION ABOUT Z               
   2 REVOLUTE JOINT                  47    ROTATION ABOUT Z               
   3 TRANSLATIONAL JOINT            127    TRANSLATION ALONG Z            
   4 REVOLUTE JOINT                  63    ROTATION ABOUT Z               
   5 REVOLUTE JOINT                  95    ROTATION ABOUT Z               
   6 REVOLUTE JOINT                 176    ROTATION ABOUT Z               
   7 SCREW JOINT                    192    ROTATION ABOUT Z               
   8 REVOLUTE JOINT                  79    ROTATION ABOUT Z               
   9 REVOLUTE CONSTRAINT            140    TRANSLATION ALONG X            
  10 REVOLUTE CONSTRAINT            140    TRANSLATION ALONG Z            
  11 REVOLUTE CONSTRAINT            111    TRANSLATION ALONG X            
  12 REVOLUTE CONSTRAINT            111    TRANSLATION ALONG Z            
  13 REVOLUTE CONSTRAINT            111    ROTATION ABOUT Y               
  14 REVOLUTE CONSTRAINT            156    TRANSLATION ALONG X            
  15 REVOLUTE CONSTRAINT            156    TRANSLATION ALONG Z            
  16 MOTION CONSTRAINT          1000000    JOINT /       176              
 
 ============================================================
 >> VELOCITY ANALYSIS
 ============================================================


                   INITIAL VELOCITY CONSTRAINT VIOLATION
      =======================================================
      CONSTRAINT_ID          TYPE                VIOLATION
      =======================================================
                                               0.000000E+00
                                                  REDUNDANT
          140            REVOLUTE              0.000000E+00
                                                  REDUNDANT
                                                  REDUNDANT
      =======================================================
                                               0.000000E+00
                                                  REDUNDANT
          111            REVOLUTE              0.000000E+00
                                               0.000000E+00
                                                  REDUNDANT
      =======================================================
                                               0.000000E+00
                                                  REDUNDANT
          156            REVOLUTE              0.000000E+00
                                                  REDUNDANT
                                                  REDUNDANT
      =======================================================
      1000000                   MOTION         0.000000E+00
      =======================================================


                      INDEPENDENT COORDINATE
      =======================================================
           ID                  TYPE              DIRECTION
      =======================================================
 ========================================================================


                       VELOCITY CONSTRAINT VIOLATION
      =======================================================
      CONSTRAINT_ID          TYPE                VIOLATION
      =======================================================
                                              -1.161823E-09
                                                  REDUNDANT
          140            REVOLUTE             -1.297772E-09
                                                  REDUNDANT
                                                  REDUNDANT
      =======================================================
                                              -3.309553E-09
                                                  REDUNDANT
          111            REVOLUTE              7.169909E-11
                                               6.580820E-17
                                                  REDUNDANT
      =======================================================
                                              -3.147966E-10
                                                  REDUNDANT
          156            REVOLUTE             -5.227552E-11
                                                  REDUNDANT
                                                  REDUNDANT
      =======================================================
      1000000                   MOTION        -4.440892E-16
      =======================================================
 >>> VELOCITY-ANALYSIS IS SUCCESSFULLY FINISHED
 
 ============================================================
 >> SEARCH DEPENDENT COORDINATES
 ============================================================
 
 ============================================================
 >> THE SIZE OF USED IBUS-ARRAY FOR DEPENDENT BODY =           4
 ============================================================
 ============================================================
 >> THE SIZE OF USED RBUS-ARRAY FOR DEPENDENT BODY =         288
 ============================================================
 >>> SUCCESSFULLY SEARCHED DEPENDENT COORDINATES
 
 ============================================================
 >> ACCELERATION ANALYSIS
 ============================================================
 >>> ACCELERATION-ANALYSIS IS SUCCESSFULLY FINISHED


                        SYSTEM CONFIGURATION
      =======================================================
      NUMBER OF GENERALIZED COORDINATE ............        8
      NUMBER OF GENERALIZED VELOCITY ..............        8
      NUMBER OF JOINT .............................   8
      NUMBER OF CUTJNT/ELEMENTARYJNT/PTCV/CVCV.....   3
      NUMBER OF RELATIVE DRIVING CONSTRAINT .......   1
      NUMBER OF TRANSLATIONAL FORCE ...............   1
      =======================================================
      TOTAL SPACE USED IN RBUS ARRAY ..............      19464
      =======================================================
      THE SYSTEM HAS        0 KINEMATIC DEGREES OF FREEDOM.
      =======================================================
 
 
 ========================================================================
 ** USED MAXIMUM ARRAY WITH RPT DATABASE           =              448
 ========================================================================
 ========================================================================
 ** USED ARRAY WITH RPT DATABASE                   =              270
 ========================================================================
      TIME       STEPSIZE     A_DELNRM      NJAC    NRES    ANRF    AINTF
   ======================================================================
  5.00000E-02  5.00000E-02  0.00000E+00       3       7       0       0
  5.00000E+00  1.00000E-01  0.00000E+00     300     700       0       0
  9.95000E+00  1.00000E-01  0.00000E+00     597    1305       0       0
  1.49000E+01  1.00000E-01  0.00000E+00     894    1899       0       0
  1.98500E+01  1.00000E-01  0.00000E+00    1191    2493       0       0
  2.00000E+01  5.00000E-02  0.00000E+00    1200    2511       0       0
 
 ======================================================================
 *** WHAT = 
 stop                                                                           
  
 ======================================================================
 !!! STOP MESSAGE IN THE SIMULATION COMMAND !!!
 
 ======================================================================
 >> MODEL NAME INFORMATION : RecurDyn_Model                                                                      
 ======================================================================
 * STARTING TIME/DATE =   9:23:27 / 2011. 8. 5
 * ENDING TIME/DATE   =   9:23:27 / 2011. 8. 5
 ======================================================================
 * USED TIME =        0 SECOND
 ======================================================================
 
 ============================================================
 >> MAKING THE OUTPUT FILES
 ============================================================
 
 ========================================================================
 >> MAKING THE OUTPUT FILES
 ========================================================================
 >>> SUCCESSFULLY MADE THE OUTPUT FILES
 
 ============================================================
 >> RD/SOLVER-PROCESSING IS SUCCESSFULLY FINISHED
 ============================================================
                                                                          
 ======================================================================== 
