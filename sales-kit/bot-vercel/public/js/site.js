// Общее поведение сайта KARINA Media
(function(){
  const nav = document.querySelector(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 10);
  onScroll(); window.addEventListener("scroll", onScroll, { passive:true });

  const burger = document.querySelector(".burger");
  if(burger){
    burger.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    document.querySelectorAll(".menu a").forEach(a =>
      a.addEventListener("click", () => document.body.classList.remove("nav-open")));
  }

  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold:.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();
