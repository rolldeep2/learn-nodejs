// this 를 사용해야 할 때 또는 NestJs를 사용 할때
// Class 를 사용해야 할 때
function func1() {
  return '';
}

func1();

const func2 = (str: string): string => {
  return str;
};

const str: string | undefined = undefined;
func2(str ?? '');
