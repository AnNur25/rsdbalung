export default function MapsEmbed() {
  // {
  //   width,
  //   height,
  // }: {
  //   width: string | number;
  //   height: string | number;
  //   }
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.3159584845444!2d113.5373520735653!3d-8.271316891762824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd68f8855000001%3A0xff16cebdb13e00ac!2sRumah%20Sakit%20Daerah%20(RSD)%20Balung%20-%20Jember!5e0!3m2!1sid!2sid!4v1742186938663!5m2!1sid!2sid"
      // width={width}
      // height={height}
      // width="100%"
      // height="100%"
      className="aspect-16/9 w-full"
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}
