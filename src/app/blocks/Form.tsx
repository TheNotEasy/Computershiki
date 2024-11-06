import Block from "@/app/components/Block";

import { Righteous } from "@/app/fonts";
import { FormEvent, useState } from "react";
import { createRequest, updateRequest } from "@/app/crud";
import { redirect, useRouter } from "next/navigation";

type FormUpdateProps = {
  isUpdate: true
  id: string
} | {
  isUpdate: false | undefined
  id: undefined
}

type FormProps = {
  title: string
  price: string
} & FormUpdateProps

const pattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/

export default function Form({title, price, isUpdate, id}: FormProps) {
  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter();

  function validate(event: FormEvent<HTMLFormElement>) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const phone = formData.get("phone") as string;
    if (!pattern.test(phone)) {
      setErrors(["Неверный номер телефона"])
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    const object: Record<string, any> = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    if (isUpdate) {
      updateRequest(object, id)
        .then(() => router.push(`/success-create?id=${id}&update=true`))
    } else {
      createRequest(object)
        .then((id) => router.push(`/success-create?id=${id}&update=false`))
    }
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  return <Block>
    <form className="flex flex-col gap-[40px] w-full pb-10" action="/" method="post" onSubmit={validate}>

      <h1 className={Righteous.className}>{title}</h1>
      <div className="flex justify-between gap-[5px] flex-col sm:flex-row">
        <input type="text" className="input w-full" placeholder="Имя *" name="first_name" required />
        <input type="text" className="input w-full" placeholder="Фамилия *" name="second_name" required />
        <input type="text" className="input w-full" placeholder="Отчество" name="last_name" required />
      </div>

      {errors.length !== 0 && (<p className="text-red-600">{errors.join("\n")}</p>)}
      <input type="text" className="input w-full" placeholder="Контактный номер (с Whatsapp) *" name="phone" required/>
      <div className="flex flex-col gap-[10px]">
        <p>Время проведения *</p>
        <div className="flex justify-between gap-[5px] flex-col sm:flex-row">
          <input type="date" className="input w-full" placeholder="Дата" name="date" required/>
          <input type="time" className="input w-full" placeholder="Время" name="time" required/>
        </div>
      </div>
      <div className="flex justify-between gap-[5px] flex-col sm:flex-row">
        <input type="number" className="input w-full" min={1} placeholder="Количество часов" name="length" required />
        <input type="number" className="input w-full" min={1} placeholder="Число участников" name="party" required />
      </div>
      <select name="payment" className="input" required defaultValue="">
        <option value="" disabled hidden>Способ оплаты</option>
        <option value="online">Онлайн перевод</option>
        <option value="cash">Наличные</option>
      </select>
      <textarea name="hints" cols={30} rows={10} className="input" placeholder="Опции и комментарии"></textarea>

      <input type="submit" value={isUpdate ? "Обновить" : "Отправить"}
             className="input w-full bg-primary cursor-pointer" />
    </form>
  </Block>
}