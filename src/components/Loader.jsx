import "../components/styles/Loader.css";
import { useLoaderContext } from "../context/LoaderContext";

const Loader = () => {
  const { loading } = useLoaderContext();

  if (!loading) return null;

  return (
    <div className="global-loader-wrapper">
      <div className="loader">
        <div className="box">
          <div className="logo">


            {/**usi jerge kodimdi qoydim */}

            
            <div class="hourglassBackground">
                <div class="hourglassContainer">
                  <div class="hourglassCurves"></div>
                  <div class="hourglassCapTop"></div>
                  <div class="hourglassGlassTop"></div>
                  <div class="hourglassSand"></div>
                  <div class="hourglassSandStream"></div>
                  <div class="hourglassCapBottom"></div>
                  <div class="hourglassGlass"></div>
                </div>
            </div>
            
          </div>


            {/* SVG ni to‘liq shu yerga qo‘y */}
            {/* SEN YUBORGAN SVG KOD O‘ZGARMASDAN */}
          
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  );
};

export default Loader;
