import "../discover.css";

import firstIllustration from '../../../img/stuff1.png';
import secondIllustration from '../../../img/stuff2.png';


function Page1() {
  return (
    <div className="discover page1">
      <div className="cards">
        <div className="discover bigcard">
          <h1 >A great punchline</h1>
          <p >
            Cras maximus et nibh sed efficitur. Ut fringilla mi ultricies metus pulvinar,
            eu tempor mi viverra. In ut euismod orci. Quisque blandit posuere sem, sit
            amet dapibus est viverra vel. Ut eget nisl efficitur, dignissim nunc in,
            aliquam dolor.
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consectetur
            eget lorem vel facilisis. Nunc nec erat interdum nunc bibendum volutpat.
            Sed congue, purus et sodales dictum, lectus tortor porttitor dui, vitae
            tempor quam purus ut dui. Donec sit amet tempus nisi. Aenean ut est at massa
            lobortis
            <br />
            Quisque blandit posuere sem, sit amet dapibus est viverra vel. Cras maximus
            et nibh sed efficitur.  In ut euismod orci. Quisque blandit posuere sem,
            sit amet dapibus est viverra vel. Nullam quis dolor eros. Ut eget nisl
            efficitur, dignissim nunc in, aliquam dolor.
          </p>
        </div>

        <div className="vertical">
          <div className="discover card">
            <div className="vertical">
              <h1>This is a title</h1>
              <p>
                Sed congue, purus et sodales dictum, lectus tortor porttitor dui,
                vitae tempor quam purus ut dui. Donec sit amet tempus nisi.
                Aenean ut est at massa lobortis</p>
            </div>
            <img className="mask1" src={firstIllustration} alt="A warrior" />
          </div>

          <div className="discover card">
            <div className="vertical">
              <h1>This is a title</h1>
              <p>
                Sed congue, purus et sodales dictum, lectus tortor porttitor dui,
                vitae tempor quam purus ut dui. Donec sit amet tempus nisi.
              </p>
            </div>
            <img className="mask2" src={secondIllustration} alt="A warrior" />
          </div>
        </div>
      </div>

      <div className="discover bottom_line" />

      <div className="discover bottom_line_content contener">
        <div className="discover bottom_line_content circle1"></div>
        <div className="discover bottom_line_content circle"></div>
        <div className="discover bottom_line_content circle"></div>
        <div className="discover bottom_line_content circle"></div>
        <div className="discover bottom_line_content circle"></div>
      </div>

    </div>

  );
}
export default Page1;
