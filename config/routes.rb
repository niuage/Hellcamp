Campfire::Application.routes.draw do
  resources :rooms do
    collection do
      match ":id" => "rooms#show", :constraints => { :id => /\d+(-\d+)*/ }
    end
    member do
      get :search
    end
    resources :messages
  end

  root :to => "home#index"

  resources :home do
    collection do
      get :server
    end
  end
end
